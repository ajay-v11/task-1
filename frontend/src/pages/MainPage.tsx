import { useState } from 'react';
import MainCard from '../components/Card/Maincard';
import MainCardForm from '../components/Card/Maincardform';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import Placeholder from '../components/Placeholdersection';
import { useCardData } from '../hooks/use-card-data';

type ViewMode = 'placeholder' | 'form';

export default function PageComponent() {
  const [viewMode, setViewMode] = useState<ViewMode>('placeholder');
  const [editMode, setEditMode] = useState<'create' | 'edit'>('edit');
  
  const { myCard, createCard, updateCard, refreshCards, userRole } = useCardData();

  // Check if user can create cards (admin or manager only)
  const canCreateCards = userRole === 'admin' || userRole === 'manager';

  const handleEditCard = () => {
    setViewMode('form');
    setEditMode('edit');
  };

  const handleCreateCard = () => {
    if (canCreateCards) {
      setViewMode('form');
      setEditMode('create');
    }
  };

  const handleSaveCard = async (data: Record<string, unknown>) => {
    try {
      let result;
      
      if (editMode === 'create') {
        // Create new card
        result = await createCard({
          ...data,
          lastUpdatedAt: new Date().toISOString(),
        });
      } else {
        // Update existing card
        if (myCard?._id) {
          result = await updateCard(myCard._id, {
            ...data,
            lastUpdatedAt: new Date().toISOString(),
          });
        }
      }

      if (result?.success) {
        // Refresh cards to update the left panel
        await refreshCards();
        // Go back to placeholder view
        setViewMode('placeholder');
      } else {
        console.error('Failed to save card:', result?.error);
        // You could show an error message here
      }
    } catch (error) {
      console.error('Error saving card:', error);
      // You could show an error message here
    }
  };

  const handleCancelEdit = () => {
    setViewMode('placeholder');
  };

  const renderRightPanel = () => {
    switch (viewMode) {
      case 'form':
        return (
          <MainCardForm
            mode={editMode}
            initialData={editMode === 'edit' && myCard ? {
              fullName: myCard.fullName || '',
              title: myCard.title || '',
              location: myCard.location || '',
              companyName: myCard.companyName || '',
              description: myCard.description || '',
              assignedTo: myCard.assignedTo?._id || '',
              contact: {
                phone: myCard.contact?.phone || '',
                email: myCard.contact?.email || '',
              },
              socialLinks: {
                instagram: myCard.socialLinks?.instagram || '',
                facebook: myCard.socialLinks?.facebook || '',
                twitter: myCard.socialLinks?.twitter || '',
              },
              services: myCard.services?.length ? myCard.services : [''],
              products: myCard.products?.length ? myCard.products : [''],
              gallery: myCard.gallery?.length ? myCard.gallery : [''],
            } : undefined}
            onSave={handleSaveCard}
            onCancel={handleCancelEdit}
          />
        );
      default:
        return <Placeholder onCreateCard={canCreateCards ? handleCreateCard : undefined} />;
    }
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      <Navbar />

      <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8'>
        <div className='flex flex-col lg:flex-row gap-4 sm:gap-6'>
          {/* Main Card */}
          <div className='w-full lg:w-[65%]'>
            <MainCard 
              onEdit={handleEditCard}
              onCreate={canCreateCards ? handleCreateCard : undefined}
            />
          </div>

          {/* Right Panel - Form or Placeholder */}
          <div className='w-full lg:w-[35%]'>
            {renderRightPanel()}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
