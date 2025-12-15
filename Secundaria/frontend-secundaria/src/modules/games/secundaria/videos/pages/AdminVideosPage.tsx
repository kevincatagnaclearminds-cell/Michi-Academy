import React, { useState, useMemo } from 'react';
import { getVideosByCategory } from '../data/mockVideos';
import { getQuizByCategory } from '../data/mockQuizzes';
import { VideoCategory } from '../types/video.types';
import { AdminSidebar } from '../components/admin/AdminSidebar';
import { AdminContentArea } from '../components/admin/AdminContentArea';
import { EditCategoryModal } from '../components/admin/EditCategoryModal';
import { DeleteVideoModal } from '../components/admin/DeleteVideoModal';
import { DeleteCategoryModal } from '../components/admin/DeleteCategoryModal';
import { DeleteQuizModal } from '../components/admin/DeleteQuizModal';
import { ConfirmExitModal } from '../components/admin/ConfirmExitModal';
import { Video } from '../types/video.types';
import { Quiz } from '../../quiz-individual/types/quiz.types';
import './AdminVideosPage.css';

export const AdminVideosPage: React.FC = () => {
  const [categories, setCategories] = useState<VideoCategory[]>(getVideosByCategory());
  const [selectedItem, setSelectedItem] = useState<{
    type: 'category' | 'video' | 'quiz' | null;
    categoryName: string | null;
    videoId: string | null;
  }>({ type: null, categoryName: null, videoId: null });
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [addingCategory, setAddingCategory] = useState(false);
  const [editingVideo, setEditingVideo] = useState<{ id: string; category: string } | null>(null);
  const [addingVideo, setAddingVideo] = useState<string | null>(null);
  const [deletingVideo, setDeletingVideo] = useState<{ id: string; category: string; title: string } | null>(null);
  const [editingQuiz, setEditingQuiz] = useState<string | null>(null);
  const [deletingQuiz, setDeletingQuiz] = useState<string | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<string | null>(null);
  const [pendingNavigation, setPendingNavigation] = useState<{
    type: 'category' | 'video' | 'quiz';
    categoryName: string;
    videoId?: string;
  } | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Crear un Map de quizzes por categoría para acceso rápido
  const quizzesMap = useMemo(() => {
    const map = new Map<string, Quiz | null>();
    categories.forEach((category) => {
      map.set(category.name, getQuizByCategory(category.name));
    });
    return map;
  }, [categories]);

  const handleCategoryNameUpdate = (oldName: string, newName: string) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.name === oldName
          ? { ...cat, name: newName, videos: cat.videos.map((v) => ({ ...v, category: newName })) }
          : cat
      )
    );
    setEditingCategory(null);
  };

  const handleVideoUpdate = (videoId: string, categoryName: string, updatedVideo: any) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.name === categoryName
          ? {
              ...cat,
              videos: cat.videos.map((v) => (v.id === videoId ? { ...v, ...updatedVideo } : v)),
            }
          : cat
      )
    );
    setEditingVideo(null);
  };

  const handleVideoDelete = (videoId: string, categoryName: string) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.name === categoryName
          ? { ...cat, videos: cat.videos.filter((v) => v.id !== videoId) }
          : cat
      )
    );
    setDeletingVideo(null);
  };

  const handleVideoReorder = (categoryName: string, videoId: string, newIndex: number) => {
    setCategories((prev) =>
      prev.map((cat) => {
        if (cat.name !== categoryName) return cat;
        const videos = [...cat.videos];
        const oldIndex = videos.findIndex((v) => v.id === videoId);
        if (oldIndex === -1) return cat;
        const [moved] = videos.splice(oldIndex, 1);
        videos.splice(newIndex, 0, moved);
        return { ...cat, videos };
      })
    );
  };

  const handleCategoryReorder = (categoryName: string, newIndex: number) => {
    setCategories((prev) => {
      const newCategories = [...prev];
      const oldIndex = newCategories.findIndex((c) => c.name === categoryName);
      if (oldIndex === -1) return prev;
      const [moved] = newCategories.splice(oldIndex, 1);
      newCategories.splice(newIndex, 0, moved);
      return newCategories;
    });
  };

  const handleCategoryMoveUp = (categoryName: string) => {
    setCategories((prev) => {
      const newCategories = [...prev];
      const index = newCategories.findIndex((c) => c.name === categoryName);
      if (index <= 0) return prev;
      [newCategories[index - 1], newCategories[index]] = [newCategories[index], newCategories[index - 1]];
      return newCategories;
    });
  };

  const handleCategoryMoveDown = (categoryName: string) => {
    setCategories((prev) => {
      const newCategories = [...prev];
      const index = newCategories.findIndex((c) => c.name === categoryName);
      if (index === -1 || index === newCategories.length - 1) return prev;
      [newCategories[index], newCategories[index + 1]] = [newCategories[index + 1], newCategories[index]];
      return newCategories;
    });
  };

  const handleVideoMoveUp = (categoryName: string, videoId: string) => {
    setCategories((prev) =>
      prev.map((cat) => {
        if (cat.name !== categoryName) return cat;
        const videos = [...cat.videos];
        const index = videos.findIndex((v) => v.id === videoId);
        if (index <= 0) return cat;
        [videos[index - 1], videos[index]] = [videos[index], videos[index - 1]];
        return { ...cat, videos };
      })
    );
  };

  const handleVideoMoveDown = (categoryName: string, videoId: string) => {
    setCategories((prev) =>
      prev.map((cat) => {
        if (cat.name !== categoryName) return cat;
        const videos = [...cat.videos];
        const index = videos.findIndex((v) => v.id === videoId);
        if (index === -1 || index === videos.length - 1) return cat;
        [videos[index], videos[index + 1]] = [videos[index + 1], videos[index]];
        return { ...cat, videos };
      })
    );
  };

  const handleCategoryAdd = (newName: string) => {
    const newCategory: VideoCategory = {
      name: newName,
      videos: [],
    };
    setCategories((prev) => [...prev, newCategory]);
    setAddingCategory(false);
    // Seleccionar la nueva categoría
    setSelectedItem({ type: 'category', categoryName: newName, videoId: null });
  };

  const handleVideoAdd = (categoryName: string, newVideo: Partial<Video>) => {
    const video: Video = {
      id: `video-${Date.now()}`,
      title: newVideo.title || 'Nuevo Video',
      description: newVideo.description,
      url: newVideo.url || '',
      category: categoryName,
      keyConcepts: newVideo.keyConcepts,
    };
    setCategories((prev) =>
      prev.map((cat) =>
        cat.name === categoryName ? { ...cat, videos: [...cat.videos, video] } : cat
      )
    );
    setAddingVideo(null);
  };

  const handleQuizDelete = (categoryName: string) => {
    // Aquí se eliminaría el quiz de la base de datos
    // Por ahora solo cerramos el modal
    setDeletingQuiz(null);
  };

  const handleCategoryDelete = (categoryName: string) => {
    setCategories((prev) => prev.filter((cat) => cat.name !== categoryName));
    setDeletingCategory(null);
  };

  const handleQuizUpdate = (categoryName: string, updatedQuiz: any) => {
    // Aquí se actualizaría el quiz en la base de datos
    // Por ahora solo cerramos el modal
    setEditingQuiz(null);
  };

  const isEditing = editingVideo !== null || addingVideo !== null || editingQuiz !== null;

  const handleSelectCategory = (categoryName: string) => {
    if (isEditing) {
      setPendingNavigation({ type: 'category', categoryName });
    } else {
      setSelectedItem({ type: 'category', categoryName, videoId: null });
    }
  };

  const handleSelectVideo = (categoryName: string, videoId: string) => {
    if (isEditing) {
      setPendingNavigation({ type: 'video', categoryName, videoId });
    } else {
      setSelectedItem({ type: 'video', categoryName, videoId });
    }
  };

  const handleSelectQuiz = (categoryName: string) => {
    if (isEditing) {
      setPendingNavigation({ type: 'quiz', categoryName });
    } else {
      setSelectedItem({ type: 'quiz', categoryName, videoId: null });
    }
  };

  const handleConfirmExit = () => {
    // Cancelar la edición actual
    setEditingVideo(null);
    setAddingVideo(null);
    setEditingQuiz(null);
    
    // Realizar la navegación pendiente
    if (pendingNavigation) {
      if (pendingNavigation.type === 'category') {
        setSelectedItem({ type: 'category', categoryName: pendingNavigation.categoryName, videoId: null });
      } else if (pendingNavigation.type === 'video' && pendingNavigation.videoId) {
        setSelectedItem({ type: 'video', categoryName: pendingNavigation.categoryName, videoId: pendingNavigation.videoId });
      } else if (pendingNavigation.type === 'quiz') {
        setSelectedItem({ type: 'quiz', categoryName: pendingNavigation.categoryName, videoId: null });
      }
    }
    
    setPendingNavigation(null);
  };

  const handleCancelExit = () => {
    setPendingNavigation(null);
  };

  const handleCategoryDeleteFromSidebar = (categoryName: string) => {
    setCategories((prev) => prev.filter((cat) => cat.name !== categoryName));
    // Si la categoría eliminada estaba seleccionada, limpiar la selección
    if (selectedItem.categoryName === categoryName) {
      setSelectedItem({ type: null, categoryName: null, videoId: null });
    }
  };

  const handleVideoDeleteFromSidebar = (categoryName: string, videoId: string, title: string) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.name === categoryName ? { ...cat, videos: cat.videos.filter((v) => v.id !== videoId) } : cat
      )
    );
    // Si el video eliminado estaba seleccionado, volver a la categoría
    if (selectedItem.videoId === videoId && selectedItem.categoryName === categoryName) {
      setSelectedItem({ type: 'category', categoryName, videoId: null });
    }
  };

  const handleQuizDeleteFromSidebar = (categoryName: string) => {
    // Aquí se eliminaría el quiz de la base de datos
    // Por ahora solo actualizamos el estado si estaba seleccionado
    if (selectedItem.categoryName === categoryName && selectedItem.type === 'quiz') {
      setSelectedItem({ type: 'category', categoryName, videoId: null });
    }
  };

  return (
    <div className="admin-videos-page">
      <AdminSidebar
        categories={categories}
        selectedItem={selectedItem}
        quizzes={quizzesMap}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        onSelectCategory={handleSelectCategory}
        onSelectVideo={handleSelectVideo}
        onSelectQuiz={handleSelectQuiz}
        onAddCategory={() => setAddingCategory(true)}
        onCategoryDelete={handleCategoryDeleteFromSidebar}
        onVideoDelete={handleVideoDeleteFromSidebar}
        onQuizDelete={handleQuizDeleteFromSidebar}
      />

      {/* Botón flotante para abrir sidebar en móvil */}
      {!sidebarOpen && (
        <button
          className="sidebar-toggle-btn"
          onClick={() => setSidebarOpen(true)}
          aria-label="Abrir menú"
        >
          <i className="fas fa-bars"></i>
        </button>
      )}

      <AdminContentArea
        selectedItem={selectedItem}
        editingVideo={editingVideo}
        addingVideo={addingVideo}
        editingQuiz={editingQuiz}
        categories={categories}
        quizzes={quizzesMap}
        onSelectCategory={handleSelectCategory}
        onVideoEdit={(categoryName, videoId) => setEditingVideo({ id: videoId, category: categoryName })}
        onVideoSave={(categoryName, videoId, updatedVideo) => {
          if (videoId) {
            handleVideoUpdate(videoId, categoryName, updatedVideo);
          } else {
            handleVideoAdd(categoryName, updatedVideo);
          }
        }}
        onVideoCancel={() => {
          setEditingVideo(null);
          setAddingVideo(null);
        }}
        onVideoDelete={(categoryName, videoId, title) =>
          setDeletingVideo({ id: videoId, category: categoryName, title })
        }
        onVideoAdd={(categoryName) => setAddingVideo(categoryName)}
        onVideoMoveUp={handleVideoMoveUp}
        onVideoMoveDown={handleVideoMoveDown}
        onQuizEdit={(categoryName) => setEditingQuiz(categoryName)}
        onQuizSave={(categoryName, updatedQuiz) => {
          handleQuizUpdate(categoryName, updatedQuiz);
        }}
        onQuizCancel={() => setEditingQuiz(null)}
        onQuizDelete={(categoryName) => setDeletingQuiz(categoryName)}
        onCategoryNameEdit={(categoryName) => setEditingCategory(categoryName)}
      />

      {/* Modales */}
      {editingCategory && (
        <EditCategoryModal
          currentName={editingCategory}
          onSave={(newName) => handleCategoryNameUpdate(editingCategory, newName)}
          onClose={() => setEditingCategory(null)}
        />
      )}


      {addingCategory && (
        <EditCategoryModal
          currentName=""
          onSave={handleCategoryAdd}
          onClose={() => setAddingCategory(false)}
        />
      )}

      {deletingVideo && (
        <DeleteVideoModal
          videoTitle={deletingVideo.title}
          onConfirm={() => handleVideoDelete(deletingVideo.id, deletingVideo.category)}
          onClose={() => setDeletingVideo(null)}
        />
      )}


      {deletingCategory && (
        <DeleteCategoryModal
          categoryName={deletingCategory}
          onConfirm={() => handleCategoryDelete(deletingCategory)}
          onClose={() => setDeletingCategory(null)}
        />
      )}

      {deletingQuiz && (
        <DeleteQuizModal
          categoryName={deletingQuiz}
          onConfirm={() => handleQuizDelete(deletingQuiz)}
          onClose={() => setDeletingQuiz(null)}
        />
      )}

      {pendingNavigation && (
        <ConfirmExitModal
          itemType={editingVideo || addingVideo ? 'video' : 'quiz'}
          onConfirm={handleConfirmExit}
          onCancel={handleCancelExit}
        />
      )}
    </div>
  );
};
