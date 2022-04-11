CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE audio_player (
    player_id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    title character varying(255),
    subtitle character varying,
    background_color character varying(255),
    progress_bar_color character varying(255),
    font_color character varying(255),
    audio_url character varying(255),
    image_url character varying(255)
);