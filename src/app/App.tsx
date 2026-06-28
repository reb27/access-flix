import { useState, useEffect, useRef } from "react";
import { NavBar } from "./components/NavBar";
import { MobileHeader, MobileBottomNav } from "./components/MobileNav";
import { MobileSearchPage } from "./components/MobileSearchPage";
import { MobileCategoriesPage } from "./components/MobileCategoriesPage";
import { HomePage } from "./components/HomePage";
import { CategoryPage, type CategoryId } from "./components/CategoryPage";
import { ListingPage } from "./components/ListingPage";
import { DetailPage } from "./components/DetailPage";
import type { ContentItem } from "./components/ContentCard";
import { WatchPage } from "./components/WatchPage";
import { ProfilePage } from "./components/ProfilePage";
import { SearchPage } from "./components/SearchPage";
import { CreateProfilePage } from "./components/CreateProfilePage";
import { ProfileDrawer } from "./components/ProfileDrawer";
import { VLibrasPanel } from "./components/VLibrasPanel";
import { OnboardingModal } from "./components/OnboardingModal";
import { StreamingModal } from "./components/StreamingModal";

type Page =
  | "home" | "listing" | "detail" | "watch"
  | "profile" | "search" | "highcontrast" | "createprofile"
  | "mobilecategories" | "mobilesearch"
  | "category-visual" | "category-auditiva" | "category-cognitiva" | "category-motora";

export type DisabilityProfile = {
  visual: boolean;
  auditiva: boolean;
  cognitiva: boolean;
  motora: boolean;
};

export type FontSize = "small" | "medium" | "large";
export type FontSpacing = "normal" | "wide";

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth <= 480 : false
  );
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 480px)");
    const h = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);
  return isMobile;
}

export default function App() {
  const isMobile = useIsMobile();
  const [page, setPage] = useState<Page>("home");
  const [librasActive, setLibrasActive] = useState(false);
  const [fontSize, setFontSize] = useState<FontSize>("medium");
  const [fontSpacing, setFontSpacing] = useState<FontSpacing>("normal");
  const [highContrast, setHighContrast] = useState(false);
  const [dyslexiaFont, setDyslexiaFont] = useState(false);
  const [profileDrawerOpen, setProfileDrawerOpen] = useState(false);
  const [onboardingOpen, setOnboardingOpen] = useState(false);
  const [streamingOpen, setStreamingOpen] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);
  const [selectedNeeds, setSelectedNeeds] = useState<string[]>([]);
  const [contentPrefs, setContentPrefs] = useState<string[]>([]);
  const [streamingPrefs, setStreamingPrefs] = useState<string[]>([]);

  /* Selected film/game for the DetailPage */
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);

  /* Mobile scroll container — reset to top on page change so DetailPage
     doesn't open scrolled halfway down */
  const mobileScrollRef = useRef<HTMLDivElement>(null);

  /* Open a content item: store it and navigate to detail */
  const openDetail = (item?: ContentItem) => {
    if (item) setSelectedItem(item);
    setPage("detail");
  };

  /* Reset scroll when the page OR selected item changes — clicking a similar title
     in DetailPage doesn't change `page`, only `selectedItem`. */
  useEffect(() => {
    if (mobileScrollRef.current) mobileScrollRef.current.scrollTop = 0;
    window.scrollTo(0, 0);
  }, [page, selectedItem]);

  /* Lifted search state */
  const [searchActive, setSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSearchChip, setActiveSearchChip] = useState<string | null>(null);

  const [disabilityProfile, setDisabilityProfile] = useState<DisabilityProfile>({
    visual: true, auditiva: true, cognitiva: false, motora: false,
  });

  /* First-visit onboarding */
  useEffect(() => {
    const visited = sessionStorage.getItem("af_visited");
    if (!visited) {
      const t = setTimeout(() => setOnboardingOpen(true), 800);
      sessionStorage.setItem("af_visited", "1");
      return () => clearTimeout(t);
    }
  }, []);

  const isHighContrast = highContrast;
  const letterSpacingMap: Record<FontSpacing, string> = { normal: "normal", wide: "0.05em" };

  /* Apply font-size + high-contrast classes on the html element so they cascade everywhere */
  useEffect(() => {
    const html = document.documentElement;
    html.classList.remove("af-font-small", "af-font-medium", "af-font-large");
    html.classList.add(`af-font-${fontSize}`);
    if (highContrast) html.classList.add("af-high-contrast");
    else              html.classList.remove("af-high-contrast");
    if (dyslexiaFont) html.classList.add("af-dyslexia");
    else              html.classList.remove("af-dyslexia");
    html.style.letterSpacing = letterSpacingMap[fontSpacing];
    return () => {
      html.style.letterSpacing = "";
    };
  }, [fontSize, fontSpacing, highContrast, dyslexiaFont]);

  const handleDeactivateSearch = () => {
    setSearchActive(false);
    setSearchQuery("");
    setActiveSearchChip(null);
  };

  const handleProfileClick = () => {
    if (!hasProfile) setOnboardingOpen(true);
    else setProfileDrawerOpen(true);
  };

  const handleCompleteProfile = (needs: string[], content: string[] = [], streaming: string[] = []) => {
    const visualIds = ["baixa_visao", "cegueira", "daltonismo"];
    const auditivaIds = ["surdez", "baixa_audicao", "libras"];
    const cognitivaIds = ["tdah", "autismo", "dislexia", "ansiedade", "def_intelectual"];
    const motoraIds = ["motora_fina", "eye_tracking"];
    setDisabilityProfile({
      visual:    needs.some((n) => visualIds.includes(n)),
      auditiva:  needs.some((n) => auditivaIds.includes(n)),
      cognitiva: needs.some((n) => cognitivaIds.includes(n)),
      motora:    needs.some((n) => motoraIds.includes(n)),
    });
    setSelectedNeeds(needs);
    setContentPrefs(content);
    setStreamingPrefs(streaming);
    setHasProfile(true);
    setPage("home");
  };

  /* ── CreateProfile is a full-page takeover ── */
  if (page === "createprofile") {
    return (
      <div className="af-app-root" style={{ letterSpacing: letterSpacingMap[fontSpacing] }}>
        <CreateProfilePage
          onBack={() => setPage("home")}
          onComplete={(needs, content, streaming) => handleCompleteProfile(needs, content, streaming)}
        />
      </div>
    );
  }

  /* ── Mobile layout (≤480px) ── */
  if (isMobile) {
    /* Full-screen pages that don't show the nav/bottom bar */
    if (page === "mobilesearch") {
      return (
        <div className="af-app-root">
          <MobileSearchPage onBack={() => setPage("home")} />
        </div>
      );
    }

    return (
      <div
        className="flex flex-col af-app-root"
        style={{ height: "100svh", overflow: "hidden", backgroundColor: "var(--af-bg, #F5F7FA)", letterSpacing: letterSpacingMap[fontSpacing] }}
      >
        {/* Header shown on all pages except categories (which has its own header) */}
        {page !== "mobilecategories" && (
          <MobileHeader onNavigate={setPage} />
        )}

        {/* Content area — min-h-0 is required so flex-1 actually respects the parent's height and doesn't push the bottom nav off-screen */}
        <div ref={mobileScrollRef} className="flex-1 overflow-y-auto" style={{ minHeight: 0 }}>
          {page === "home" && (
            <HomePage
              onNavigate={setPage as any}
              disabilityProfile={disabilityProfile}
              hasProfile={hasProfile}
              selectedNeeds={selectedNeeds}
              contentPrefs={contentPrefs}
              streamingPrefs={streamingPrefs}
              onItemClick={openDetail}
              onShowStreaming={() => setStreamingOpen(true)}
            />
          )}

          {page === "mobilecategories" && (
            <MobileCategoriesPage
              onNavigate={setPage}
              onItemClick={() => setPage("detail")}
            />
          )}

          {page.startsWith("category-") && (
            <CategoryPage
              categoryId={page.replace("category-", "") as CategoryId}
              onBack={() => setPage("home")}
              onItemClick={openDetail}
              onStreamingClick={() => setStreamingOpen(true)}
              onNavigateCategory={(c) => setPage(`category-${c}` as Page)}
            />
          )}

          {page === "listing" && (
            <ListingPage onNavigate={setPage as any} />
          )}
          {page === "detail" && (
            <DetailPage onSelectItem={openDetail}
              item={selectedItem}
              onBack={() => setPage("home")}
              onWatch={() => setPage("watch")}
              hasProfile={hasProfile}
              onShowOnboarding={() => setOnboardingOpen(true)}
            />
          )}
          {page === "watch" && (
            <WatchPage onBack={() => setPage("detail")} />
          )}
          {page === "profile" && (
            <ProfilePage
              onBack={() => setPage("home")}
              onGoToCreateProfile={() => setPage("createprofile")}
              isLoggedIn={hasProfile}
              selectedNeeds={selectedNeeds}
            />
          )}
        </div>

        <MobileBottomNav onNavigate={setPage} currentPage={page} dark={false} />

        {/* Overlays */}
        {profileDrawerOpen && (
          <ProfileDrawer
            isOpen={profileDrawerOpen}
            onClose={() => setProfileDrawerOpen(false)}
            disabilityProfile={disabilityProfile}
            onProfileChange={setDisabilityProfile}
          />
        )}
        {librasActive && <VLibrasPanel onClose={() => setLibrasActive(false)} />}
        {onboardingOpen && (
          <OnboardingModal
            onClose={() => setOnboardingOpen(false)}
            onCreateProfile={() => {}}
            onGoToCreateProfile={() => { setOnboardingOpen(false); setPage("createprofile"); }}
          />
        )}
        {streamingOpen && <StreamingModal onClose={() => setStreamingOpen(false)} hasProfile={hasProfile} />}
      </div>
    );
  }

  /* ── Desktop / tablet layout ── */
  return (
    <div
      className="flex flex-col af-app-root"
      style={{ minHeight: "100vh", letterSpacing: letterSpacingMap[fontSpacing] }}
    >
      <NavBar
        onNavigate={setPage as any}
        currentPage={page}
        librasActive={librasActive}
        onLibrasToggle={() => setLibrasActive(!librasActive)}
        highContrast={highContrast}
        onContrastToggle={() => setHighContrast((v) => !v)}
        dyslexiaFont={dyslexiaFont}
        onDyslexiaToggle={() => setDyslexiaFont((v) => !v)}
        fontSize={fontSize}
        fontSpacing={fontSpacing}
        onFontSizeChange={setFontSize}
        onFontSpacingChange={setFontSpacing}
        onProfileClick={handleProfileClick}
        searchQuery={searchQuery}
        searchActive={searchActive}
        onSearchChange={setSearchQuery}
        onSearchActivate={() => setSearchActive(true)}
        onSearchDeactivate={handleDeactivateSearch}
        activeSearchChip={activeSearchChip}
        onSearchChipChange={setActiveSearchChip}
      />

      {searchActive ? (
        <SearchPage
          query={searchQuery}
          activeChip={activeSearchChip}
          onSuggestionClick={(label) => setSearchQuery(label)}
        />
      ) : (
        <>
          {page === "home" && <HomePage onNavigate={setPage as any} disabilityProfile={disabilityProfile} hasProfile={hasProfile} selectedNeeds={selectedNeeds} contentPrefs={contentPrefs} streamingPrefs={streamingPrefs} onItemClick={openDetail} onShowStreaming={() => setStreamingOpen(true)} />}
          {page.startsWith("category-") && (
            <CategoryPage
              categoryId={page.replace("category-", "") as CategoryId}
              onBack={() => setPage("home")}
              onItemClick={openDetail}
              onStreamingClick={() => setStreamingOpen(true)}
              onNavigateCategory={(c) => setPage(`category-${c}` as Page)}
            />
          )}
          {page === "listing" && <ListingPage onNavigate={setPage as any} />}
          {page === "detail" && <DetailPage item={selectedItem} onBack={() => setPage("home")} onWatch={() => setPage("watch")} onSelectItem={openDetail} hasProfile={hasProfile} onShowOnboarding={() => setOnboardingOpen(true)} />}
          {page === "watch" && <WatchPage onBack={() => setPage("detail")} />}
          {page === "profile" && (
            <ProfilePage
              onBack={() => setPage("home")}
              onGoToCreateProfile={() => setPage("createprofile")}
              isLoggedIn={hasProfile}
              selectedNeeds={selectedNeeds}
            />
          )}
          {page === "search" && <SearchPage query={searchQuery} activeChip={activeSearchChip} onSuggestionClick={(label) => setSearchQuery(label)} />}
        </>
      )}

      {profileDrawerOpen && <ProfileDrawer isOpen={profileDrawerOpen} onClose={() => setProfileDrawerOpen(false)} disabilityProfile={disabilityProfile} onProfileChange={setDisabilityProfile} />}
      {librasActive && <VLibrasPanel onClose={() => setLibrasActive(false)} />}
      {onboardingOpen && (
        <OnboardingModal
          onClose={() => setOnboardingOpen(false)}
          onCreateProfile={() => {}}
          onGoToCreateProfile={() => { setOnboardingOpen(false); setPage("createprofile"); }}
        />
      )}
      {streamingOpen && <StreamingModal onClose={() => setStreamingOpen(false)} hasProfile={hasProfile} />}
    </div>
  );
}
