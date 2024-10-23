import { useAppSelector } from '@/lib/hooks';

const useAdminPermissionsCheck = () => {
    const authStore = useAppSelector(s => s.auth)
    return {
        isAdmin: authStore.roles.includes('Admin'),
        isModerator: authStore.roles.includes('Admin') || authStore.roles.includes('Moderator')
    };
}

export default useAdminPermissionsCheck;