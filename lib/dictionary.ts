export type Language = "en" | "al";

export const translations = {
  en: {
    hero: {
      title: "Search a city. Discover every service.",
      description: "A city-first tourism marketplace for Albania where travelers can quickly find accommodation, food, things to do, events, transport, and local services.",
      discoverByCity: "Discover Albania by city",
      findEveryService: "Find every service in one place",
      verifiedListings: "Verified listings",
      cityFirst: "City-first",
      fastDiscovery: "Fast discovery",
      searchPlaceholder: "Search tours, stays, restaurants, or transport...",
      searchButton: "Search",
      popularCities: "Popular Cities"
    },
    nav: {
        home: "Home",
        services: "Services",
        blog: "Blog",
        addListing: "Add Listing",
        login: "Login",
        register: "Register",
        logout: "Logout",
      dashboard: "Dashboard",
      packet: "Packet",
      explore: "Explore",
      cities: "Cities",
      aboutUs: "About Us",
      faq: "FAQ",
      terms: "Terms and Conditions",
      privacy: "Privacy Policy"
    },
    legal: {
      intro: "These terms define how users, service providers, and administrators interact on the tourism platform.",
      lastUpdated: "Last updated: May 17, 2026"
    },
    common: {
        readMore: "Read More",
        keyword: "Keyword",
        anyCity: "Any city...",
      result: "result",
      results: "results",
      searchPrefix: "Search: ",
      noListingsFound: "No listings found.",
      tryAdjustSearch: "Try adjusting your search criteria.",
        priceRange: "Price Range",
        minRating: "Minimum Rating",
        showResults: "Show results",
        title: "Title",
        city: "City",
        description: "Description",
        descriptionPlaceholder: "Describe the experience, highlights and what makes this listing special.",
        selectCategory: "Select a category",
        selectSubcategory: "Select a subcategory",
        viewAll: "View All",
        explore: "Explore",
        loading: "Loading...",
        noResults: "No results found.",
        location: "Location",
        category: "Category",
        subcategory: "Subcategory",
        price: "Price",
        rating: "Rating",
        contact: "Contact",
        bookNow: "Book Now",
        quickFacts: "Quick facts",
        editorialSpotlight: "Editorial spotlight",
        featuredExperience: "Featured experience",
        travelersChoice: "Travelers choice",
        inspiration: "Inspiration to get you going",
        journal: "Journal",
        latestStories: "Latest travel stories",
        nightSuffix: "night",
        personSuffix: "person"
    },
    home: {
        editorialTitle: "Find things to do for everything you are into",
        editorialDesc: "Browse curated experiences and book trusted listings from a marketplace designed for discovery and confidence.",
        featuredTitle: "A travel marketplace built like a guide and a booking engine",
        featuredDesc: "The structure blends editorial inspiration, traveler trust signals, and direct discovery. It should feel useful before it feels promotional.",
        categoriesTitle: "Choose the service you need",
        categoriesSub: "Browse by category",
        popularDestinations: "Popular Destinations",
        popularSub: "Discover the most visited cities and regions in Albania.",
        featuredSub: "Hand-picked experiences for you.",
        latestTitle: "Latest Listings",
        latestSub: "Recently approved services.",
        whereToSleepTitle: "Where to sleep",
        whereToSleepDesc: "Discover the best accommodations in Albania, from luxury hotels to traditional guesthouses.",
        whereToEatTitle: "Where to eat",
        whereToEatDesc: "Enjoy Albanian cuisine in the best restaurants recommended by us.",
        eventsTitle: "Events",
        eventsDesc: "Experience Albania's vibrant culture through festivals, concerts, and local events.",
        transportTitle: "Transport",
        transportDesc: "Move easily across Albania with our trusted transport services.",
        exploreTitle: "Can not-miss picks near you",
        marketplaceTitle: "Featured marketplace picks",
        marketplaceDesc: "These cards should feel like premium inventory from the moment they load. Strong imagery, rating context, and a direct path to details.",
        awardsTitle: "Awards Best of the Best for trusted tourism listings",
        awardsDesc: "Top picks from across the marketplace, chosen by visitors, ratings, and quality moderation.",
        seeWinners: "See the winners",
        verifiedStays: "Verified stays",
        staysDesc: "Premium properties, boutique villas, and homestays.",
        guidedTours: "Guided tours",
        toursDesc: "City tours, heritage walks, and nature adventures.",
        localTransport: "Local transport",
        localTransportDesc: "Transfers, rentals, boats, and airport pickups.",
        editorialBlog: "Editorial blog",
        blogDesc: "Stories, guides, and inspiration for travelers.",
        travelStories: "Travel stories with a premium editorial feel",
        storiesSub: "Use the blog to publish guides, destination tips, and seasonal recommendations.",
        noPosts: "No published posts yet",
        noPostsSub: "Use the blog section to share destination guides and booking tips."
        ,
        addAccommodation: "Add Accommodation",
        addPlaceToEat: "Add Place to Eat",
        addEvent: "Add Event",
        addTransport: "Add Transport",
        addService: "Add Service",
        addProduct: "Add Product",
        addAttraction: "Add Attraction",
        advantageTitle: "The Advantage",
        advantageSubtitle: "Why choose our marketplace?",
        advantageDesc: "We connect you directly with verified local hosts to ensure authentic experiences and the best prices.",
        benefitVerifiedTitle: "Verified Quality",
        benefitVerifiedDesc: "Every listing is manually reviewed for accuracy.",
        benefitDirectTitle: "Direct Booking",
        benefitDirectDesc: "Communicate directly with the hosts via phone or WhatsApp.",
        benefitLocalTitle: "Local Expertise",
        benefitLocalDesc: "Get insider tips from people who live in the cities you visit.",
        benefitNoFeesTitle: "No Hidden Fees",
        benefitNoFeesDesc: "What you see is what you pay. Transparent pricing always."
    },
    services: {
        title: "Discover Albania",
        subtitle: "Every service in every city",
        filters: "Filters",
        allCategories: "All Categories",
        allRegions: "All Regions",
        sortBy: "Sort by",
        results: "Results",
        reset: "Reset Filters"
    },
    blog: {
        heroTitle: "Stories that Inspire",
        heroSubtitle: "Journeys that Matter",
        heroDesc: "Discover curated guides, insider tips, and breathtaking stories from the heart of Albania.",
        allStories: "All Stories",
        journalEntry: "Journal Entry",
        inspiredTitle: "Inspired by this story?",
        inspiredDesc: "Discover verified services and start planning your own Albanian adventure today.",
        exploreServices: "Explore Marketplace",
        archiveTitle: "The Archive",
        latestPub: "Latest Publications",
      readStory: "Read Story",
      loadMore: "Load More Stories",
      journalLabel: "The Journal",
      fallbacks: [
        {
          slug: "sample-1",
          title: "Discover the Hidden Gems of the Albanian Riviera",
          excerpt: "From secret beaches to ancient ruins, explore the best kept secrets of the coast.",
          createdAt: new Date().toISOString()
        },
        {
          slug: "sample-2",
          title: "A Culinary Journey Through Tirana's Best Eateries",
          excerpt: "Taste the evolution of Albanian cuisine in the heart of the capital.",
          createdAt: new Date().toISOString()
        },
        {
          slug: "sample-3",
          title: "Hiking the Accursed Mountains: A Practical Guide",
          excerpt: "Everything you need to know for a safe and breathtaking mountain adventure.",
          createdAt: new Date().toISOString()
        }
      ],
      recently: "Recently",
      authorEditor: "Editor"
    },
    listings: {
      title: "Browse all listings",
      subtitle: "All services and categories",
      description: "Explore the latest approved offerings with city, service, guest count and contact details all in one place.",
      latestTitle: "Latest approved listings",
      noApprovedFound: "No approved listings found.",
      noApprovedFoundSub: "If you have added a listing recently, it may still be waiting for approval.",
      verifiedBadge: "Verified and reviewed content"
    },
    addListing: {
        title: "Submit your Service",
        subtitle: "Join the elite network of Albanian tourism providers.",
        proTips: "Pro Tips",
        tip1Title: "High Quality Photos",
        tip1Desc: "Listings with 5+ HD photos get 80% more bookings.",
        tip2Title: "Detailed Description",
        tip2Desc: "Be specific about what makes your service unique.",
        tip3Title: "Accurate Location",
        tip3Desc: "Ensure travelers can find you easily on the map.",
        formTitle: "Service Details",
        formDesc: "Provide the essential information about your listing."
    },
    
    forms: {
      listing: {
        bannerRequired: "Banner image is required.",
        submittedForApproval: "Listing submitted for approval",
        titlePlaceholder: "Mountain Escape Villa",
        locationPlaceholder: "Tirana",
        villageLabel: "Village / Area",
        selectVillage: "Select village",
        featuresAmenities: "Features & Amenities",
        addCustomTagPlaceholder: "Add custom tag... (Press Enter)",
        contactPhone: "Contact Phone",
        exactAddress: "Exact Address",
        exactAddressPlaceholder: "Street name, Building nr.",
        mainBannerPhoto: "Main Banner Photo",
        mainBannerNote: "This is the large photo shown at the top.",
        galleryLabel: "Gallery (5 Photos)",
        galleryNote: "Please select exactly 5 photos for the best display.",
        creatingService: "Creating Service...",
        launchListing: "Launch Listing",
        villageSelectPlaceholder: "Select village"
      }
    },
    auth: {
      signedInSuccess: "Signed in successfully!",
      googleAuthFailed: "Google authentication failed",
      googleUnauthorizedDomain: "Google sign-in failed because this domain is not authorized in Firebase. Add your Vercel domain to Firebase Auth authorized domains.",
      continueWithGoogle: "Continue with Google"
    },
    login: {
      welcome: "Welcome back",
      signInTitle: "Sign in to Explore Albania.",
      description: "Access your personalized dashboard to manage listings, save favorites, and share your experiences.",
      featureLabel: "Feature",
      features: ["Saved trips", "Moderation tools", "Reviews", "Listing management"],
      newToPlatform: "New to the platform?"
    },
    register: {
      start: "Start your journey",
      joinTitle: "Join the Community.",
      description: "Create an account to list your services, interact with travelers, and help grow the Albanian tourism industry.",
      benefitLabel: "Benefit",
      benefits: ["Quick approval", "Free listing", "Direct contact", "Global reach"],
      alreadyAccount: "Already have an account?"
    },
    host: {
        spotlight: "Host Spotlight",
        title: "Become a host and share the beauty of Albania.",
        description: "Join our community of trusted providers. List your stay, tour, or service and reach travelers from all over the world.",
        button: "Start Hosting",
        joined: "Join 500+ local hosts",
        feature1: "Quality Trust",
        feature2: "Fast Growth"
    },
    footer: {
      platformName: "Tourism Platform",
      tagline: "Plan, review, and book the kind of trip people remember.",
      description: "Built for travelers, hosts, and editors. A single platform for discovery, trust, and high-quality tourism listings.",
      exploreServices: "Explore services",
      addListing: "Add a listing",
      getStarted: "Get started",
      contactTitle: "Contact Us",
      follow: "Follow",
      rightsReserved: "All rights reserved."
    },
    listing: {
      request: "Request",
      call: "Call",
      whatsapp: "WhatsApp",
      share: "Share",
      linkCopied: "Link copied to clipboard!",
      linkCopyFailed: "Failed to copy link",
      verified: "VERIFIED",
      nightSuffix: "night",
      personSuffix: "person",
      savedToFavorites: "Saved to favorites",
      removedFromFavorites: "Removed from favorites",
      updateFavoritesFailed: "Failed to update favorites",
      showAllPhotos: "Show all photos"
    },
    terms: [
        {
          title: "1. Acceptance of Terms",
          body:
            "By accessing or using this platform, you agree to these Terms and to all applicable laws. If you do not agree, please do not use the platform."
        },
        {
          title: "2. Platform Role",
          body:
            "The platform helps users discover tourism-related services, contact providers, and submit listings. We do not own, operate, or guarantee third-party services listed by users."
        },
        {
          title: "3. Accounts and Eligibility",
          body:
            "You are responsible for account activity under your credentials and for keeping your login details secure. You must provide accurate profile and listing information."
        },
        {
          title: "4. Listings, Content, and Moderation",
          body:
            "Users are responsible for listing content, media, claims, prices, and contact details they publish. Listings may be reviewed by administrators and can be approved, rejected, edited for clarity, or removed if they violate law, intellectual property rights, safety expectations, or platform rules."
        },
        {
          title: "5. Prohibited Conduct",
          body:
            "You agree not to publish misleading information, unlawful offers, harmful content, spam, malware, or abusive communications. Attempts to bypass moderation or impersonate other people are not allowed."
        },
        {
          title: "6. Reviews and User Interactions",
          body:
            "Reviews must reflect real experiences and follow respectful conduct standards. We may remove reviews or comments that are fraudulent, abusive, discriminatory, or unrelated to the service experience."
        },
        {
          title: "7. Payments and Packages",
          body:
            "If paid features or packages are offered, billing terms are shown at checkout. Unless explicitly stated otherwise, fees are non-refundable after activation of the purchased feature."
        },
        {
          title: "8. Intellectual Property",
          body:
            "Platform design, code, branding, and original content are protected by applicable intellectual property laws. You keep ownership of content you upload, and grant us a limited license to display and process it for platform operation."
        },
        {
          title: "9. Disclaimer and Limitation of Liability",
          body:
            "The platform is provided \"as is\" and \"as available.\" We are not liable for losses resulting from third-party listings, provider actions, availability issues, booking outcomes, or user-to-user transactions."
        },
        {
          title: "10. Suspension and Termination",
          body:
            "We may suspend or terminate accounts or listings that violate these Terms, create legal or security risk, or harm platform integrity."
        },
        {
          title: "11. Changes to These Terms",
          body:
            "We may update these Terms periodically. Continued use of the platform after updates means you accept the revised version."
        },
        {
          title: "12. Contact",
          body:
            "For questions about these Terms, contact platform administration through the official support or admin communication channels provided in the platform."
        }
      ]
  },
  al: {
    hero: {
      title: "Kërko një qytet. Zbulo çdo shërbim.",
      description: "Një treg turistik i fokusuar te qytetet për Shqipërinë ku udhëtarët mund të gjejnë shpejt akomodim, ushqim, aktivitete, evente, transport dhe shërbime lokale.",
      discoverByCity: "Zbulo Shqipërinë sipas qytetit",
      findEveryService: "Gjej çdo shërbim në një vend",
      verifiedListings: "Listime të verifikuara",
      cityFirst: "Qyteti i pari",
      fastDiscovery: "Zbulim i shpejtë",
      searchPlaceholder: "Kërko ture, qëndrime, restorante ose transport...",
      searchButton: "Kërko",
      popularCities: "Qytete Popullore"
    },
    nav: {
        home: "Kreu",
        services: "Shërbimet",
        blog: "Blog",
        addListing: "Shto Listim",
        login: "Hyr",
        register: "Regjistrohu",
        logout: "Dil",
      dashboard: "Paneli",
      packet: "Paketat",
      explore: "Eksploro",
      cities: "Qytetet",
      aboutUs: "Rreth Nesh",
      faq: "Pyetje të Shpeshta",
      terms: "Kushtet",
      privacy: "Privatesia"
    },
    legal: {
      intro: "Këto kushte përshkruajnë mënyrën se si përdoruesit, ofruesit e shërbimeve dhe administratorët ndërveprojnë në platformën turistike.",
      lastUpdated: "Përditësuar më: 17 Maj 2026"
    },
    common: {
        readMore: "Lexo më shumë",
        keyword: "Fjala kyçe",
        anyCity: "Çdo qytet...",
      result: "rezultat",
      results: "rezultate",
      searchPrefix: "Kërkimi: ",
      noListingsFound: "Nuk u gjet asnjë listim.",
      tryAdjustSearch: "Përpiquni të ndryshoni kriteret e kërkimit.",
        priceRange: "Gama e Çmimit",
        minRating: "Vlerësimi Minimal",
        showResults: "Shfaq rezultatet",
        title: "Titulli",
        city: "Qyteti",
        description: "Përshkrimi",
        descriptionPlaceholder: "Përshkruani përvojën, pikat kryesore dhe çfarë e bën këtë vend unik.",
        selectCategory: "Zgjidhni një kategori",
        selectSubcategory: "Zgjidhni një nënkategori",
        viewAll: "Shiko të gjitha",
        explore: "Eksploro",
        loading: "Duke u ngarkuar...",
        noResults: "Nuk u gjet asnjë rezultat.",
        location: "Vendndodhja",
        category: "Kategoria",
        subcategory: "Nënkategoria",
        price: "Çmimi",
        rating: "Vlerësimi",
        contact: "Kontakt",
        bookNow: "Rezervo tani",
        quickFacts: "Fakte të shpejta",
        editorialSpotlight: "Seksioni editorial",
        featuredExperience: "Eksperiencë e rekomanduar",
        travelersChoice: "Zgjedhja e udhëtarëve",
        inspiration: "Inspirim për të filluar",
        journal: "Revista",
        latestStories: "Historitë e fundit të udhëtimit",
        nightSuffix: "natë",
        personSuffix: "person"
    },
    home: {
        editorialTitle: "Gjeni aktivitete për gjithçka që ju pëlqen",
        editorialDesc: "Shfletoni përvoja të kurura dhe rezervoni listime të besuara nga një treg i krijuar për zbulim dhe besim.",
        featuredTitle: "Një treg udhëtimi i ndërtuar si udhëzues dhe motor rezervimi",
        featuredDesc: "Struktura ndërthur frymëzimin editorial, sinjalet e besimit të udhëtarëve dhe zbulimin direkt. Duhet të ndihet i dobishëm para se të ndihet promocional.",
        categoriesTitle: "Zgjidhni shërbimin që ju nevojitet",
        categoriesSub: "Shfletoni sipas kategorisë",
        popularDestinations: "Destinacionet Popullore",
        popularSub: "Zbuloni qytetet dhe rajonet më të vizituara në Shqipëri.",
        featuredSub: "Përvoja të zgjedhura posaçërisht për ju.",
        latestTitle: "Listimet e Fundit",
        latestSub: "Shërbimet e miratuara së fundmi.",
        whereToSleepTitle: "Ku do të flemë",
        whereToSleepDesc: "Zbuloni akomodimet më të mira në Shqipëri, nga hotelet luksoze deri te shtëpitë tradicionale.",
        whereToEatTitle: "Ku do të hamë",
        whereToEatDesc: "Shijoni kuzhinën shqiptare në restorantet më të mira të rekomanduara nga ne.",
        eventsTitle: "Eventet",
        eventsDesc: "Përjetoni kulturën e gjallë të Shqipërisë përmes festivaleve, koncerteve dhe ngjarjeve lokale.",
        transportTitle: "Transporti",
        transportDesc: "Lëvizni lehtësisht nëpër Shqipëri me shërbimet tona të besuara të transportit.",
        exploreTitle: "Zgjedhje që nuk duhen humbur pranë jush",
        marketplaceTitle: "Zgjedhjet e rekomanduara të tregut",
        marketplaceDesc: "Këto karta duhet të ndihen si inventar premium që nga momenti i ngarkimit. Imazhe të forta, kontekst vlerësimi dhe një rrugë direkte drejt detajeve.",
        awardsTitle: "Çmimet Më të Mirët e Më të Mirëve për listimet e besuara të turizmit",
        awardsDesc: "Zgjedhjet kryesore nga e gjithë platforma, të zgjedhura nga vizitorët, vlerësimet dhe moderimi i cilësisë.",
        seeWinners: "Shiko fituesit",
        verifiedStays: "Qëndrime të verifikuara",
        staysDesc: "Prona premium, vila boutique dhe shtëpi pritëse.",
        guidedTours: "Ture të udhëzuara",
        toursDesc: "Ture në qytet, shëtitje trashëgimie dhe aventura në natyrë.",
        localTransport: "Transport lokal",
        localTransportDesc: "Transferta, makina me qira, varka dhe pritje në aeroport.",
        editorialBlog: "Blog editorial",
        blogDesc: "Histori, udhëzues dhe frymëzim për udhëtarët.",
        travelStories: "Histori udhëtimi me një ndjesi editoriale premium",
        storiesSub: "Përdorni blogun për të publikuar udhëzues, këshilla destinacioni dhe rekomandime sezonale.",
        noPosts: "Nuk ka ende postime të publikuara",
        noPostsSub: "Përdorni seksionin e blogut për të ndarë udhëzues destinacioni dhe këshilla rezervimi."
          ,
          addAccommodation: "Shto Akomodim",
          addPlaceToEat: "Shto Restorant",
          addEvent: "Shto Event",
          addTransport: "Shto Transport",
          addService: "Shto Shërbim",
          addProduct: "Shto Produkt",
          addAttraction: "Shto Atraksion",
          advantageTitle: "Avantazhi",
          advantageSubtitle: "Pse të zgjidhni tregun tonë?",
          advantageDesc: "Ne ju lidhim drejtpërdrejt me hostë lokalë të verifikuar për të siguruar përvoja autentike dhe çmimet më të mira.",
          benefitVerifiedTitle: "Cilësi e Verifikuar",
          benefitVerifiedDesc: "Çdo listim shqyrtohet manualisht për saktësi.",
          benefitDirectTitle: "Rezervim Direkt",
          benefitDirectDesc: "Komunikoni drejtpërdrejt me hostët me telefon ose WhatsApp.",
          benefitLocalTitle: "Ekspertizë Lokale",
          benefitLocalDesc: "Merrni këshilla nga njerëzit që jetojnë në qytetet që vizitoni.",
          benefitNoFeesTitle: "Pa Tarifa të Fshehura",
          benefitNoFeesDesc: "Ajo që shihni është ajo që paguani. Çmime transparente gjithmonë."
    },
    services: {
        title: "Zbulo Shqipërinë",
        subtitle: "Çdo shërbim në çdo qytet",
        filters: "Filtrat",
        allCategories: "Të gjitha Kategoritë",
        allRegions: "Të gjitha Rajonet",
        sortBy: "Rendit sipas",
        results: "Rezultate",
        reset: "Pastro Filtrat"
    },
    blog: {
      heroTitle: "Historitë që Frymëzojnë",
      heroSubtitle: "Udhëtime që Lënë Gjurmë",
      heroDesc: "Zbuloni udhëzues të kuruar, këshilla lokale dhe histori që ju nxisin të eksploroni Shqipërinë.",
      allStories: "Të gjitha historitë",
      journalEntry: "Hyrje në revistë",
      inspiredTitle: "E frymëzuar nga kjo histori?",
      inspiredDesc: "Zbuloni shërbime të verifikuara dhe filloni të planifikoni aventurën tuaj shqiptare sot.",
      exploreServices: "Eksploro Shërbimet",
        archiveTitle: "Arkiva",
        latestPub: "Publikimet e Fundit",
        readStory: "Lexo Historinë",
        loadMore: "Ngarko më shumë histori",
      journalLabel: "Revista",
      fallbacks: [
        {
          slug: "sample-1",
          title: "Zbuloni Thesarët e Fshehtë të Rivierës Shqiptare",
          excerpt: "Nga plazhet e fshehta te rrënojat e lashta, eksploroni sekretet më të mira të bregdetit.",
          createdAt: new Date().toISOString()
        },
        {
          slug: "sample-2",
          title: "Një Udhëtim Kulinar nëpër Restorantet më të Mira të Tiranës",
          excerpt: "Shijoni evolucionin e kuzhinës shqiptare në zemër të kryeqytetit.",
          createdAt: new Date().toISOString()
        },
        {
          slug: "sample-3",
          title: "Ngjitja e Bjeshkëve të Nemuna: Një Udhëzues Praktik",
          excerpt: "Gjithçka që duhet të dini për një aventurë malore të sigurt dhe mbresëlënëse.",
          createdAt: new Date().toISOString()
        }
      ],
      recently: "Së fundmi",
      authorEditor: "Redaktor"
    },
    listings: {
      title: "Shfleto të gjitha listimet",
      subtitle: "Të gjitha shërbimet dhe kategoritë",
      description: "Zbuloni ofertat e fundit të miratuara me qytet, shërbim, numër të mysafirëve dhe detaje kontakti të gjitha në një vend.",
      latestTitle: "Listimet e fundit të miratuara",
      noApprovedFound: "Nuk u gjet asnjë listim i miratuar.",
      noApprovedFoundSub: "Nëse keni shtuar një listim së fundmi, ai mund të jetë ende duke pritur miratimin.",
      verifiedBadge: "Përmbajtje e verifikuar dhe e shqyrtuar"
    },
    addListing: {
        title: "Dorëzoni Shërbimin tuaj",
        subtitle: "Bashkohuni me rrjetin elitë të ofruesve të turizmit shqiptar.",
        proTips: "Këshilla Pro",
        tip1Title: "Foto me cilësi të lartë",
        tip1Desc: "Listimet me 5+ foto HD marrin 80% më shumë rezervime.",
        tip2Title: "Përshkrim i detajuar",
        tip2Desc: "Jini specifik për atë që e bën shërbimin tuaj unik.",
        tip3Title: "Vendndodhja e saktë",
        tip3Desc: "Sigurohuni që udhëtarët t'ju gjejnë lehtësisht në hartë.",
        formTitle: "Detajet e Shërbimit",
        formDesc: "Jepni informacionin thelbësor për listimin tuaj."
    },
    forms: {
      listing: {
        bannerRequired: "Foto e banerit është e detyrueshme.",
        submittedForApproval: "Listimi u dërgua për miratim",
        titlePlaceholder: "Villa e bukur në mal",
        locationPlaceholder: "Tiranë",
        villageLabel: "Fshati / Zona",
        selectVillage: "Zgjidh fshatin",
        featuresAmenities: "Karakteristikat & Pajisjet",
        addCustomTagPlaceholder: "Shto tag të personalizuar... (Shtyp Enter)",
        contactPhone: "Telefoni i Kontaktit",
        exactAddress: "Adresa e saktë",
        exactAddressPlaceholder: "Emri i rrugës, Nr. i ndërtesës",
        mainBannerPhoto: "Foto Kryesore (Banner)",
        mainBannerNote: "Kjo është fotoja e madhe që shfaqet në krye.",
        galleryLabel: "Galeria (5 Foto)",
        galleryNote: "Ju lutem zgjidhni saktësisht 5 foto për paraqitjen më të mirë.",
        creatingService: "Duke krijuar shërbimin...",
        launchListing: "Publiko Listimin",
        villageSelectPlaceholder: "Zgjidh fshatin"
      }
    },
    auth: {
      signedInSuccess: "Hyrja u krye me sukses!",
      googleAuthFailed: "Autentikimi me Google dështoi",
      googleUnauthorizedDomain: "Hyrja me Google dështoi sepse ky domen nuk është i autorizuar në Firebase. Shtoni domenin e Vercel tek domenet e autorizuara të Firebase Auth.",
      continueWithGoogle: "Vazhdoni me Google"
    },
    login: {
      welcome: "Mirë se vini përsëri",
      signInTitle: "Hyni për të Eksploruar Shqipërinë.",
      description: "Aksesoni panelin tuaj të personalizuar për të menaxhuar listimet, ruajtur të preferuarat dhe ndarë përvojat tuaja.",
      featureLabel: "Funksioni",
      features: ["Udhëtime të ruajtura", "Mjetet e moderimit", "Vlerësimet", "Menaxhimi i listimeve"],
      newToPlatform: "I ri në platformë?"
    },
    register: {
      start: "Filloni udhëtimin tuaj",
      joinTitle: "Bashkohuni me Komunitetin.",
      description: "Krijoni një llogari për të listuar shërbimet tuaja, ndërvepruar me udhëtarët dhe ndihmuar në rritjen e industrisë së turizmit shqiptar.",
      benefitLabel: "Përfitimi",
      benefits: ["Miratim i shpejtë", "Listim falas", "Kontakt direkt", "Arritje globale"],
      alreadyAccount: "Keni një llogari?"
    },
    host: {
        spotlight: "Fokus te Host-i",
        title: "Bëhu host dhe ndaj bukurinë e Shqipërisë.",
        description: "Bashkohuni me komunitetin tonë të ofruesve të besuar. Listoni qëndrimin, turin ose shërbimin tuaj dhe arrini udhëtarë nga e gjithë bota.",
        button: "Fillo si Host",
        joined: "Bashkohu me 500+ hostë lokalë",
        feature1: "Besim Cilësor",
        feature2: "Rritje e Shpejtë"
    },
    footer: {
      platformName: "Platforma Turistike",
      tagline: "Planifikoni, rishikoni dhe rezervoni llojin e udhëtimit që mbahet mend.",
      description: "Ndertuar per udhetaret, hostet dhe editoret. Nje platforme e vetme per zbulim, besim dhe listime turistike cilesore.",
      exploreServices: "Eksploro sherbimet",
      addListing: "Shto nje listim",
      getStarted: "Fillo tani",
      contactTitle: "Na Kontaktoni",
      follow: "Na ndiqni",
      rightsReserved: "Te gjitha te drejtat e rezervuara."
    },
    listing: {
      request: "Kërkesë",
      call: "Telefon",
      whatsapp: "WhatsApp",
      share: "Shpërnda",
      linkCopied: "Linku u kopjua!",
      linkCopyFailed: "Dështoi kopjimi i linkut",
      verified: "VERIFIKUAR",
      nightSuffix: "natë",
      personSuffix: "person",
      savedToFavorites: "U ruajt te të preferuarat",
      removedFromFavorites: "U hoq nga të preferuarat",
      updateFavoritesFailed: "Dështoi përditësimi",
      showAllPhotos: "Shiko të gjitha fotot"
    }
      ,
      terms: [
        {
          title: "1. Pranimi i Kushteve",
          body:
            "Duke hyrë ose përdorur këtë platformë, ju pranoni këto Kushte dhe të gjitha ligjet në fuqi. Nëse nuk pranoni, ju lutemi mos përdorni platformën."
        },
        {
          title: "2. Roli i Platformës",
          body:
            "Platforma ndihmon përdoruesit të gjejnë shërbime turistike, të kontaktojnë ofruesit dhe të publikojnë listime. Ne nuk zotërojmë, drejtojmë, ose garantojmë shërbimet e palëve të treta të listuara."
        },
        {
          title: "3. Llogaritë dhe Përshtatshmëria",
          body:
            "Jeni përgjegjës për aktivitetin e llogarisë suaj dhe për ruajtjen e sigurisë së kredencialeve. Duhet të siguroni informacion të saktë për profilin dhe listimet tuaja."
        },
        {
          title: "4. Listimet, Përmbajtja dhe Moderimi",
          body:
            "Përdoruesit janë përgjegjës për përmbajtjen e listimeve, mediat, pretendimet, çmimet dhe detajet e kontaktit që publikojnë. Listimet mund të shqyrtohen nga administratorët dhe mund të miratohen, refuzohen, redaktohen për qartësi, ose hiqen nëse shkelin ligjet, të drejtat e pronësisë intelektuale, ose rregullat e platformës."
        },
        {
          title: "5. Sjellje e Ndaluar",
          body:
            "Ju pranoni që të mos publikoni informacione mashtruese, oferta të paligjshme, përmbajtje të dëmshme, spam, malware ose komunikime abuzuese. Përpjekjet për të shmangur moderimin ose për t'u impersonuar janë të ndaluara."
        },
        {
          title: "6. Vlerësimet dhe Ndërveprimet e Përdoruesve",
          body:
            "Vlerësimet duhet të reflektojnë përvoja reale dhe të respektojnë standardet e sjelljes. Ne mund të heqim vlerësime ose komente që janë mashtruese, abuzuese, diskriminuese, ose të papërshtatshme."
        },
        {
          title: "7. Pagesat dhe Paketat",
          body:
            "Nëse ofrohen funksione të paguara ose paketa, kushtet e faturimit shfaqen në procesin e pagesës. Përveç nëse theksohet ndryshe, tarifat nuk janë të rimbursueshme pas aktivizimit të shërbimit."
        },
        {
          title: "8. Pronësia Intelektuale",
          body:
            "Dizajni i platformës, kodi, marka dhe përmbajtja origjinale mbrohen nga ligjet përkatëse të pronësisë intelektuale. Ju mbani pronësinë e përmbajtjes që ngarkoni dhe na jepni një licencë të kufizuar për ta shfaqur dhe përpunuar për funksionimin e platformës."
        },
        {
          title: "9. Përjashtim dhe Kufizim i Përgjegjësisë",
          body:
            "Platforma ofrohet \"as is\" dhe \"as available\". Ne nuk jemi përgjegjës për humbjet që rrjedhin nga listimet e palëve të treta, veprimet e ofruesve, probleme të disponueshmërisë, rezultate rezervimesh, ose transaksione midis përdoruesve."
        },
        {
          title: "10. Ndalim dhe Përfundim",
          body:
            "Ne mund të pezullrojmë ose të përfundojmë llogari ose listime që shkelin këto Kushte, krijojnë rrezik ligjor ose sigurie, ose dëmtojnë integritetin e platformës."
        },
        {
          title: "11. Ndryshimet në Këto Kushte",
          body:
            "Ne mund të përditësojmë këto Kushte periodikisht. Përdorimi i mëtejshëm i platformës pas përditësimeve do të nënkuptojë pranimin e versionit të rishikuar."
        },
        {
          title: "12. Kontakt",
          body:
            "Për pyetje rreth këtyre Kushteve, kontaktoni administratën e platformës përmes kanaleve zyrtare të mbështetjes ose komunikimit që gjenden në platformë."
        }
      ]
  }
};
