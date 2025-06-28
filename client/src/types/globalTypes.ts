export interface UserProps {
    id: string;
    name: string;
}

export interface PopUpProps {
    visible: boolean;
    closable: boolean;
    size: 'sm' | 'md' | 'lg';
    onClose: () => void
}
