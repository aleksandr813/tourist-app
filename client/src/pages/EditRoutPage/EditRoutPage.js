import { useEffect, useRef, useState } from "react";
import { load } from "@2gis/mapgl";

const MAPGL_KEY = "3437ff1b-602e-4a97-a906-169b3493070a";

export default function EditRoutPage({ setPage, PAGES }) {
    const containerRef = useRef(null);
    const mapRef = useRef(null);
    const [mapError, setMapError] = useState(null);

    useEffect(() => {
        let cancelled = false;

        load()
            .then((mapglAPI) => {
                if (cancelled || !containerRef.current) return;

                mapRef.current = new mapglAPI.Map(containerRef.current, {
                    center: [37.618423, 55.751244],
                    zoom: 10,
                    key: MAPGL_KEY,
                });
            })
            .catch((error) => {
                if (cancelled) return;
                console.error(error);
                setMapError(error.message);
            });

        return () => {
            cancelled = true;
            mapRef.current?.destroy();
            mapRef.current = null;
        };
    }, []);

    if (mapError) {
        return (
            <div>
                <p>Не удалось загрузить карту.</p>
                <p>{mapError}</p>
            </div>
        );
    }

    return <div ref={containerRef} style={{ width: '100%', height: '500px' }} />;
}
