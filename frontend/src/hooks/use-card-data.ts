import {useState, useEffect, useMemo} from 'react';
import {useAuthStore} from '../lib/authStore';
import api from '../lib/api';
import type {Card} from '../lib/types';

export const useCardData = () => {
  const {user, isAuthenticated, isLoading: authLoading} = useAuthStore();
  const [cards, setCards] = useState<Card[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Don't fetch if auth is still loading
    if (authLoading) {
      return;
    }

    // If not authenticated, clear data and stop loading
    if (!isAuthenticated) {
      setCards(null);
      setLoading(false);
      return;
    }

    // If no user, wait
    if (!user) {
      setLoading(true);
      return;
    }

    const fetchCards = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await api.get<{
          success: boolean;
          data: {cards: Card[]};
        }>('/cards');

        // Handle the nested response structure based on your API response
        if (
          response.data &&
          response.data.success &&
          response.data.data &&
          response.data.data.cards
        ) {
          setCards(response.data.data.cards);
        } else {
          // Fallback for different response structure
          const cardsData = response.data?.data?.cards || [];
          setCards(cardsData);
        }

        setError(null);
      } catch (err) {
        console.error('Failed to fetch cards:', err);
        setError('Failed to load card data. Please try again.');
        setCards(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCards();
  }, [isAuthenticated, authLoading, user]); // Added user to dependency array

  // Use useMemo to re-calculate myCard only when cards or user changes
  const myCard = useMemo(() => {
    if (!cards || !user) {
      console.log('No cards or user, returning null');
      return null;
    }
    if (!cards || !user) {
      return null;
    }

    const userCard =
      cards.find((card) => card.assignedTo?._id === user._id) || null;

    if (user.role === 'user') {
      console.log('User card found:', userCard);
    } else if (user.role === 'manager') {
      console.log('Manager card found:', userCard);
    } else if (user.role === 'admin') {
      console.log('Admin card found:', userCard);
    }

    return userCard;
  }, [cards, user]);

  return {cards, myCard, loading, error, userRole: user?.role};
};
