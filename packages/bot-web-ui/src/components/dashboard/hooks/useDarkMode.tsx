import React from 'react';

export const useDarkMode = store => {
    const {
        ui: { is_dark_mode_on },
    } = store;
    const [is_dark_mode, setDarkMode] = React.useState(false);
    const ui_store = JSON.parse(localStorage?.getItem('ui_store'));
    const theme_dark = document.body.classList.contains('theme--dark');

    React.useEffect(() => {
        const onStorageChanged = () => {
            const data = is_dark_mode_on;
            if (data) {
                setDarkMode(JSON.parse(data));
            }
        };
        if (theme_dark || is_dark_mode_on) {
            setDarkMode(true);
        }

        window.addEventListener('storage', onStorageChanged);

        return () => {
            window.removeEventListener('storage', onStorageChanged);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return {
        is_dark_mode,
    };
};
