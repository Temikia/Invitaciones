import { lazy, Suspense, useEffect, useRef } from "react";
import { useNarrative } from "../hooks/useNarrative";
import { LanguageProvider, useLanguage } from "../config/language";
import { Atmosphere } from "../components/ui/Atmosphere";
import { InvitationHeader } from "../components/ui/InvitationHeader";
import { PageAtmosphere } from "../components/ui/PageOrnaments";
import { MusicProvider } from "../components/ui/Music";
import { PageAudioControl } from "../components/ui/AudioControl";
import { useAppRoute } from "./router";
import {
  Scene01Flower,
  Scene02Camila,
  Scene03Music,
  Scene04Portrait,
  Scene05Prayer,
  Scene06Sun,
  Scene07Family,
} from "../components/scenes/Discovery";
import {
  Scene08Date,
  Scene09Venue,
  Scene10Gallery,
  Scene11Itinerary,
  Scene12Companion,
  Scene13Countdown,
} from "../components/scenes/Celebration";
import {
  Scene14Gifts,
  Scene15Dress,
  Scene16RSVP,
  Scene17Memories,
  Scene18Thanks,
  Scene19Lake,
} from "../components/scenes/Finale";

const loadMemories = () => import("./Memories");
const loadAlbum = () => import("./Album");
const Memories = lazy(loadMemories);
const Album = lazy(loadAlbum);
function Invitation() {
  const root = useRef<HTMLDivElement>(null);
  useNarrative(root);
  return (
    <div ref={root} className="invitation" data-motion="full">
      <Atmosphere />
      <InvitationHeader />
      <main>
        <Scene01Flower />
        <Scene02Camila />
        <Scene03Music />
        <Scene04Portrait />
        <Scene05Prayer />
        <Scene06Sun />
        <Scene07Family />
        <Scene08Date />
        <Scene09Venue />
        <Scene10Gallery />
        <Scene11Itinerary />
        <Scene12Companion />
        <Scene13Countdown />
        <Scene14Gifts />
        <Scene15Dress />
        <Scene16RSVP />
        <Scene17Memories />
        <Scene18Thanks />
        <Scene19Lake />
      </main>
    </div>
  );
}
function AppContent() {
  const { t } = useLanguage();
  const path = useAppRoute();
  useEffect(() => {
    // Precarga las otras páginas para que el cambio interno sea inmediato.
    const id = window.setTimeout(() => { void loadAlbum(); void loadMemories(); }, 2500);
    return () => window.clearTimeout(id);
  }, []);
  return path === "/recuerdos" || path === "/album" ? (
    <>
      <PageAtmosphere />
      <InvitationHeader />
      <PageAudioControl />
      <Suspense fallback={<p className="loading">{t("loading")}</p>}>
        {path === "/album" ? <Album /> : <Memories />}
      </Suspense>
    </>
  ) : (
    <Invitation />
  );
}
export default function App() {
  return <LanguageProvider><MusicProvider><AppContent /></MusicProvider></LanguageProvider>;
}
