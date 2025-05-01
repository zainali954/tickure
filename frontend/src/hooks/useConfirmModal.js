// hooks/useConfirmDialog.js
import { useState, useCallback } from "react";
import ConfirmDialog from "../components/ConfirmDialog";

export const useConfirmDialog = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [dialogConfig, setDialogConfig] = useState({
        title: "",
        message: "",
        onConfirm: null,
        onCancel: null,
    });

    const confirm = useCallback((title, message) => {
        return new Promise((resolve) => {
            setDialogConfig({
                title,
                message,
                onConfirm: () => {
                    resolve(true);
                    setIsOpen(false);
                },
                onCancel: () => {
                    resolve(false);
                    setIsOpen(false);
                },
            });
            setIsOpen(true);
        });
    }, []);

    const ConfirmDialogComponent = () => (
        <ConfirmDialog
            open={isOpen}
            title={dialogConfig.title}
            message={dialogConfig.message}
            onConfirm={dialogConfig.onConfirm}
            onCancel={dialogConfig.onCancel}
        />
    );

    return { confirm, ConfirmDialogComponent };
};
