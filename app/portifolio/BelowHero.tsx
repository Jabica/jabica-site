"use client";

import { useEffect } from "react";
import { MessageStatement } from "./MessageStatement";
import { EditorialStory } from "./EditorialStory";
import { HorizontalGallery } from "./HorizontalGallery";
import { WorkSplit } from "./WorkSplit";
import { BuildsHall } from "./BuildsHall";
import { CtaBanner } from "./CtaBanner";
import { LabShowcase } from "./LabShowcase";
import { PartnersMarquee } from "./PartnersMarquee";
import { SocialsCallout } from "./SocialsCallout";
import { SiteFooter } from "./SiteFooter";
import { ensureGsap } from "./motion";

export function BelowHero() {
  useEffect(() => {
    const { ScrollTrigger } = ensureGsap();
    const refresh = () => ScrollTrigger.refresh();
    const id = requestAnimationFrame(refresh);
    window.addEventListener("load", refresh);
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("load", refresh);
    };
  }, []);

  return (
    <>
      <MessageStatement />
      <EditorialStory />
      <HorizontalGallery />
      <WorkSplit />
      <BuildsHall />
      <CtaBanner />
      <LabShowcase />
      <PartnersMarquee />
      <SocialsCallout />
      <SiteFooter />
    </>
  );
}
