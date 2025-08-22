import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { InertiaProgress } from '@inertiajs/progress';

import '../css/app.css';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';

createInertiaApp({
    // ini menggantikan import dinamis biasa
    resolve: name => resolvePageComponent(
        `./Pages/${name}.jsx`, 
        import.meta.glob('./Pages/**/*.jsx')
    ),
    setup({ el, App, props }) {
        createRoot(el).render(<App {...props} />);
    },
});

InertiaProgress.init();
