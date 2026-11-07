import { lazy, Suspense, useRef } from "react";
import { useNarrative } from "../hooks/useNarrative";
import { LanguageProvider, useLanguage } from "../config/language";
import { Atmosphere } from "../components/ui/Atmosphere";
import { InvitationHeader } from "../components/ui/InvitationHeader";
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

const Memories = lazy(() => import("./Memories"));
const Album = lazy(() => import("./Album"));
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
  const path = window.location.pathname.replace(/\/$/, "");
  return path === "/recuerdos" || path === "/album" ? (
    <>
      <InvitationHeader />
      <Suspense fallback={<p className="loading">{t("loading")}</p>}>
        {path === "/album" ? <Album /> : <Memories />}
      </Suspense>
    </>
  ) : (
    <Invitation />
  );
}
export default function App() {
  return <LanguageProvider><AppContent /></LanguageProvider>;
}
