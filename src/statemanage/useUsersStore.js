import { create } from 'zustand';

const useUsersStore = create((set) => ({
  allUsers: [],
  loadingUsers: false,
  setAllUsers: (users) => set({ allUsers: users }),
  setLoadingUsers: (loading) => set({ loadingUsers: loading }),
  incrementUnread: (userId) =>
    set((state) => ({
      allUsers: state.allUsers.map((user) =>
        user._id === userId
          ? { ...user, unreadCount: (user.unreadCount || 0) + 1 }
          : user
      ),
    })),
  setUnreadCount: (userId, count) =>
    set((state) => ({
      allUsers: state.allUsers.map((user) =>
        user._id === userId ? { ...user, unreadCount: count } : user
      ),
    })),
  updateUserStatus: (userId, status) =>
    set((state) => ({
      allUsers: state.allUsers.map((user) =>
        user._id === userId ? { ...user, status } : user
      ),
    })),
  updateUserProfile: (userId, userData) =>
    set((state) => ({
      allUsers: state.allUsers.map((user) =>
        user._id === userId ? { ...user, ...userData } : user
      ),
    })),
}));

export default useUsersStore;
