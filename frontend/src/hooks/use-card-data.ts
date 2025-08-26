import {useState, useEffect, useMemo} from 'react';
import api, {cardApi} from '../lib/api';
import type {Card} from '../lib/types';
import {useAuthStore} from '../lib/authStore';

export const useCardData = () => {
  const {user, isAuthenticated, isInitialized} = useAuthStore();
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCards = async () => {
    if (!isAuthenticated || !user) {
      setCards([]);
      setLoading(false);
      setError(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await api.get('/cards');

      let cardsData: Card[] = [];

      // Handle different API response structures
      if (response.data?.success && response.data?.data?.cards) {
        // Structure: { success: true, data: { cards: Card[] } }
        cardsData = response.data.data.cards;
      } else if (response.data?.data?.cards) {
        // Structure: { data: { cards: Card[] } }
        cardsData = response.data.data.cards;
      } else if (response.data?.cards) {
        // Structure: { cards: Card[] }
        cardsData = response.data.cards;
      } else if (Array.isArray(response.data)) {
        // Structure: Card[]
        cardsData = response.data;
      } else {
        // No cards or unexpected structure
        cardsData = [];
      }

      setCards(cardsData);
    } catch (err: any) {
      console.error('Failed to fetch cards:', err);
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        'Failed to load cards. Please try again.';
      setError(errorMessage);
      setCards([]);
    } finally {
      setLoading(false);
    }
  };

  // Create a new card (supports optional profile picture)
  const createCard = async (cardData: any, profilePicture?: File) => {
    try {
      setLoading(true);
      setError(null);

      const response = await cardApi.create(cardData, profilePicture);

      if (response.success && response.data?.card) {
        // Add the new card to the list
        setCards((prev) => [response.data.card, ...prev]);
        return {success: true, card: response.data.card};
      } else {
        throw new Error(response.message || 'Failed to create card');
      }
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message || err?.message || 'Failed to create card';
      setError(errorMessage);
      return {success: false, error: errorMessage};
    } finally {
      setLoading(false);
    }
  };

  // Update an existing card (supports optional profile picture)
  const updateCard = async (
    cardId: string,
    cardData: any,
    profilePicture?: File
  ) => {
    try {
      setLoading(true);
      setError(null);

      const response = await cardApi.update(cardId, cardData, profilePicture);

      if (response.success && response.data?.card) {
        // Update the card in the list
        setCards((prev) =>
          prev.map((card) => (card._id === cardId ? response.data.card : card))
        );
        return {success: true, card: response.data.card};
      } else {
        throw new Error(response.message || 'Failed to update card');
      }
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message || err?.message || 'Failed to update card';
      setError(errorMessage);
      return {success: false, error: errorMessage};
    } finally {
      setLoading(false);
    }
  };

  // Fetch cards when auth state changes
  useEffect(() => {
    // Don't fetch if still initializing
    if (!isInitialized) {
      return;
    }

    // Clear data if not authenticated
    if (!isAuthenticated || !user) {
      setCards([]);
      setLoading(false);
      setError(null);
      return;
    }

    // Fetch cards if authenticated
    fetchCards();
  }, [isAuthenticated, user, isInitialized]);

  // Find user's assigned card
  const myCard = useMemo(() => {
    if (!user || cards.length === 0) {
      return null;
    }

    return cards.find((card) => card.assignedTo === user.email) || null;
  }, [cards, user]);

  // Calculate statistics
  const stats = useMemo(() => {
    return {
      total: cards.length,
      assigned: cards.filter((card) => card.assignedTo).length,
      unassigned: cards.filter((card) => !card.assignedTo).length,
    };
  }, [cards]);

  // Manual refresh function
  const refreshCards = () => {
    if (isAuthenticated && user) {
      fetchCards();
    }
  };

  return {
    // Data
    cards,
    myCard,
    loading,
    error,
    stats,

    // Functions
    refreshCards,
    createCard,
    updateCard,

    // Helper properties
    hasCards: cards.length > 0,
    userRole: user?.role || null,
    isAuthenticated,
    isInitialized,
  };
};
