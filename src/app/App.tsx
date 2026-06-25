import { useState, useEffect } from "react";
import { NavBar } from "./components/NavBar";
import { HighContrastNavBar } from "./components/HighContrastNavBar";
import { MobileHeader, MobileBottomNav } from "./components/MobileNav";
import { MobileFeed } from "./components/MobileFeed";
import { MobileSearchPage } from "./components/MobileSearchPage";
import { MobileCategoriesPage } from "./components/MobileCategoriesPage";
import { HomePage } from "./components/HomePage";
import { HighContrastHomePage } from "./components/HighContrastHomePage";
import { ListingPage } from "./components/ListingPage";
import { DetailPage } from "./components/DetailPage";
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
  | "mobilecategories" | "mobilesearch";

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
  const [profileDrawerOpen, setProfileDrawerOpen] = useState(false);
  const [onboardingOpen, setOnboardingOpen] = useState(false);
  const [streamingOpen, setStreamingOpen] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);
  const [selectedNeeds, setSelectedNeeds] = useState<string[]>([]);

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

  const isHighContrast = page === "highcontrast";
  const fontSizeMap: Record<FontSize, string> = { small: "14px", medium: "16px", large: "20px" };
  const letterSpacingMap: Record<FontSpacing, string> = { normal: "normal", wide: "0.05em" };

  const handleDeactivateSearch = () => {
    setSearchActive(false);
    setSearchQuery("");
    setActiveSearchChip(null);
  };

  const handleProfileClick = () => {
    if (!hasProfile) setOnboardingOpen(true);
    else setProfileDrawerOpen(true);
  };

  const handleCompleteProfile = (needs: string[]) => {
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
    setHasProfile(true);
    setPage("home");
  };

  /* ── CreateProfile is a full-page takeover ── */
  if (page === "createprofile") {
    return (
      <div style={{ fontSize: fontSizeMap[fontSize], letterSpacing: letterSpacingMap[fontSpacing] }}>
        <CreateProfilePage
          onBack={() => setPage("home")}
          onComplete={(needs) => handleCompleteProfile(needs)}
        />
      </div>
    );
  }

  /* ── Mobile layout (≤480px) ── */
  if (isMobile && !isHighContrast) {
    /* Full-screen pages that don't show the nav/bottom bar */
    if (page === "mobilesearch") {
      return (
        <div style={{ fontSize: fontSizeMap[fontSize] }}>
          <MobileSearchPage onBack={() => setPage("home")} />
        </div>
      );
    }

    return (
      <div
        className="flex flex-col"
        style={{ height: "100svh", overflow: "hidden", backgroundColor: page === "home" ? "#0a0a0a" : "#f5f7fa", fontSize: fontSizeMap[fontSize], letterSpacing: letterSpacingMap[fontSpacing] }}
      >
        {/* Header only shown on non-home pages (feed has its own built-in header) */}
        {page !== "home" && page !== "mobilecategories" && (
          <MobileHeader onNavigate={setPage} />
        )}

        {/* Content area */}
        <div className="flex-1 overflow-hidden">
          {page === "home" && (
            <MobileFeed
              onItemClick={() => setPage("detail")}
              onSearchClick={() => setPage("mobilesearch")}
            />
          )}

          {page === "mobilecategories" && (
            <MobileCategoriesPage
              onNavigate={setPage}
              onItemClick={() => setPage("detail")}
            />
          )}

          {page === "listing" && (
            <div className="h-full overflow-y-auto" style={{ backgroundColor: "#F5F7FA" }}>
              <ListingPage onNavigate={setPage as any} />
            </div>
          )}
          {page === "detail" && (
            <div className="h-full overflow-y-auto">
              <DetailPage
                onBack={() => setPage("home")}
                onWatch={() => setPage("watch")}
                hasProfile={hasProfile}
                onShowOnboarding={() => setOnboardingOpen(true)}
              />
            </div>
          )}
          {page === "watch" && (
            <div className="h-full overflow-y-auto">
              <WatchPage onBack={() => setPage("detail")} />
            </div>
          )}
          {page === "profile" && (
            <div className="h-full overflow-y-auto">
              <ProfilePage
                onBack={() => setPage("home")}
                onGoToCreateProfile={() => setPage("createprofile")}
                isLoggedIn={hasProfile}
                selectedNeeds={selectedNeeds}
              />
            </div>
          )}
        </div>

        {/* Bottom nav — dark when on the immersive feed */}
        <MobileBottomNav onNavigate={setPage} currentPage={page} dark={page === "home"} />

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
      className="flex flex-col"
      style={{ minHeight: "100vh", backgroundColor: isHighContrast ? "#000000" : "#F5F7FA", fontSize: fontSizeMap[fontSize], letterSpacing: letterSpacingMap[fontSpacing] }}
    >
      {isHighContrast ? (
        <HighContrastNavBar onNavigate={setPage as any} />
      ) : (
        <NavBar
          onNavigate={setPage as any}
          currentPage={page}
          librasActive={librasActive}
          onLibrasToggle={() => setLibrasActive(!librasActive)}
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
      )}

      {searchActive && !isHighContrast ? (
        <SearchPage
          query={searchQuery}
          activeChip={activeSearchChip}
          onSuggestionClick={(label) => setSearchQuery(label)}
        />
      ) : (
        <>
          {page === "home" && <HomePage onNavigate={setPage as any} disabilityProfile={disabilityProfile} onShowStreaming={() => setStreamingOpen(true)} />}
          {page === "highcontrast" && <HighContrastHomePage onNavigate={setPage as any} />}
          {page === "listing" && <ListingPage onNavigate={setPage as any} />}
          {page === "detail" && <DetailPage onBack={() => setPage("listing")} onWatch={() => setPage("watch")} hasProfile={hasProfile} onShowOnboarding={() => setOnboardingOpen(true)} />}
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
