import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "../../components/audio-player/sp-audio-player.js";

const meta: Meta = {
  title: "Components/AudioPlayer",
  component: "sp-audio-player",
  tags: ["autodocs"],
  argTypes: {
    src: { control: "text", description: "URL del audio" },
    title: { control: "text", description: "Título de la pista" },
    artist: { control: "text", description: "Nombre del artista" },
    cover: { control: "text", description: "URL de la imagen de portada" },
    autoplay: { control: "boolean" },
    loop: { control: "boolean" },
  },
  args: {
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    title: "Canción de Ejemplo",
    artist: "Artista Demo",
    cover: "",
    autoplay: false,
    loop: false,
  },
  render: ({ src, title, artist, cover, autoplay, loop }) => html`
    <sp-audio-player
      src=${src}
      title=${title}
      artist=${artist}
      cover=${cover}
      ?autoplay=${autoplay}
      ?loop=${loop}
    ></sp-audio-player>
  `,
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const WithCover: Story = {
  args: {
    cover: "https://picsum.photos/seed/music/80/80",
    title: "Lo-Fi Beats",
    artist: "Chillhop Music",
  },
};

export const WithLoop: Story = { args: { loop: true } };

export const Minimal: Story = {
  args: { title: "Podcast Episodio 42", artist: "", cover: "" },
};
