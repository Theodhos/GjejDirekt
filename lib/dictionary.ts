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
      intro: "Welcome to TripShqip. By using our platform, you accept these Terms of Use. Please read them carefully.",
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
        cancel: "Cancel",
        error: "Something went wrong",
        discard: "Discard",
        on: "On",
        off: "Off",
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
      directions: "Directions",
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
    admin: {
      consoleTitle: "Admin Console",
      heroTitle: "Control the tourism platform from one place.",
      addListing: "Add listing",
      viewServices: "View services",
      blogStudio: "Blog Studio",
      blogPublishTitle: "Publish blog content directly from admin",
      blogPublishDesc: "Add destination guides, travel stories, and editorial content without leaving the control panel.",
      draftMode: "Draft mode",
      chars: "Chars",
      posts: "Posts",
      coverImage: "Cover image URL",
      coverImagePlaceholder: "Cover image URL",
      publishImmediately: "Publish immediately",
      publishPost: "Publish post",
      saveDraft: "Save draft",
      addCityTitle: "Add Albania City (Admin)",
      addCityDesc: "Only admin can add new Albania cities. They appear automatically on home and city pages.",
      cityNameLabel: "City name",
      cityNamePlaceholder: "e.g. Himare",
      regionLabel: "Region",
      regionPlaceholder: "South coast",
      imageLabel: "Image URL",
      descriptionLabel: "Description",
      descriptionPlaceholder: "Short city description",
      addCityBtn: "Add city",
      availableCitiesLabel: "Available cities",
      deleteBtn: "Delete",
      confirmDeleteCity: "Are you sure you want to delete {label}?",
      deleteCityFailed: "Failed to delete city",
      cityDeleted: "City deleted.",
      deletedListingsSuffix: "listings.",
      cityAddedMessage: "City added. Home and city page will update automatically.",
      addCityFailed: "Failed to add city",
      profileSaved: "Profile saved",
      resetSent: "Reset link sent to your email",
      fullNameLabel: "Full name",
      emailLabel: "Email address",
      passwordLabel: "Password",
      passwordResetDesc: "Send a secure reset link to your email.",
      resetPasswordBtn: "Reset Password",
      saveProfileBtn: "Save Profile",
      navAdminLabel: "Admin",
      profileDataTitle: "Profile data",
      forgotPasswordTitle: "Password",
      forgotPasswordDesc: "Send a secure reset link to your email.",
      pwResetSubtitle: "Account security",
      pwResetTip1: "The reset link expires in 30 minutes",
      pwResetTip2: "Delivered only to your verified email",
      pwResetTip3: "Your current password stays active until you change it",
      identifiedAs: "Identified as",
      pendingModeration: "Pending moderation",
      pendingCountText: "There are {count} listings waiting for your approval.",
      approvalRateLabel: "Approval rate",
      users: "Users",
      listings: "Listings",
      pending: "Pending",
      approved: "Approved",
      reports: "Reports",
      blogs: "Blogs",
      viewListings: "View listings",
      addCity: "Add city",
      addListingShort: "Add listing",
      cities: "Cities",
      cityStudio: "City studio",
      cityPublishTitle: "Add a new city directly from admin",
      cityPublishDesc: "Create a destination with a title, description, and banner photo. New cities appear in the cities list where you can edit them anytime.",
      cityDescPlaceholder: "Short description shown on the city banner...",
      bannerPhotoLabel: "Banner photo",
      bannerPhotoHint: "Only a banner photo is used for the city.",
      chooseFile: "Choose a photo",
      uploadBanner: "Upload banner",
      cityAdded: "City added.",
      cityUpdated: "City banner updated.",
      cityBannerEditor: "Edit city banners",
      editBanner: "Edit banner",
      saveChanges: "Save changes",
      moderationQueue: "Moderation queue",
      pendingApprovals: "Services awaiting approval",
      allCaughtUp: "All caught up",
      noPendingDesc: "There are no services waiting for approval right now.",
      verifiedLabel: "Verified",
      unverifiedLabel: "Unverified",
      invalidEmail: "Please enter a valid email address.",
      resetConfirmTitle: "Confirm password reset",
      resetConfirmDesc: "We will send a password reset link to your email. Continue?",
      viewBtn: "View",
      editBtn: "Edit",
      deleteListingBtn: "Delete",
      confirmDeleteListing: "Are you sure you want to delete the service \"{title}\"?",
      listingDeleted: "Service deleted successfully!",
      deleteListingFailed: "Delete failed",
      deleteListingError: "An error occurred while deleting"
    },
    approveButton: "Approve",
    rejectButton: "Reject",
    listingApproved: "Listing approved",
    listingRejected: "Listing rejected",
    categories: {
      header: "Category",
      description: "Explore the full range of services and experiences under {category}. Find the best local providers and book with confidence."
      ,
      names: {
        akomodim: "Accommodation",
        restorante: "Restaurants",
        atraksione: "Attractions",
        evente: "Events",
        "sherbime-turistike": "Tourism Services",
        "produkte-lokale": "Local Products",
        transport: "Transport"
      },
      subnames: {
        akomodim: {
          hotel: "Hotel",
          resort: "Resort",
          vila: "Villa",
          apartament: "Apartment",
          guesthouse: "Guesthouse",
          "te-tjera": "Other"
        },
        restorante: {
          tradicional: "Traditional",
          internacional: "International",
          "fast-food": "Fast Food",
          "kafe-bar": "Cafe & Bar",
          "te-tjera": "Other"
        },
        atraksione: {
          natyre: "Nature",
          historike: "Historical",
          muze: "Museum",
          plazh: "Beach",
          "te-tjera": "Other"
        },
        evente: {
          koncerte: "Concerts",
          festivale: "Festivals",
          panaire: "Fairs",
          dasma: "Weddings",
          "te-tjera": "Other"
        },
        "sherbime-turistike": {
          guida: "Guides",
          agjenci: "Agency",
          ekskursione: "Excursions",
          rezervime: "Bookings",
          "te-tjera": "Other"
        },
        "produkte-lokale": {
          artizanat: "Handmade",
          ushqimore: "Food",
          suvenire: "Souvenirs",
          agro: "Agro Products",
          "te-tjera": "Other"
        },
        transport: {
          aeroport: "Airport",
          "makine-me-qira": "Car Rental",
          varka: "Boat",
          taksi: "Taxi",
          "te-tjera": "Other"
        }
      }
    },
    terms: [
        {
          title: "1. About TripShqip",
          body:
            "TripShqip is a tourism platform that helps users discover and contact businesses, attractions, and tourism services in Albania. The platform serves as an informational and promotional space for businesses and users."
        },
        {
          title: "2. Use of the Platform",
          body:
            "By using TripShqip, you agree to: use the platform lawfully, not publish false or misleading content, not infringe the rights of other users, and not use the platform for spam or unauthorized activities."
        },
        {
          title: "3. Listings and Content",
          body:
            "Businesses are responsible for the accuracy of the information they publish, including descriptions, contacts, photos, prices, links, and other information. TripShqip reserves the right to moderate, edit, refuse, or remove listings that are deemed inappropriate, inaccurate, or in conflict with these terms."
        },
        {
          title: "4. Verified, Ads, Ads Pro",
          body:
            "TripShqip may offer promotional options such as Verified, Ads, and Ads Pro. These options provide greater exposure for listings, but do not guarantee specific results or reservations."
        },
        {
          title: "5. Contacts and Reservations",
          body:
            "TripShqip enables direct contact between users and businesses. TripShqip is not a party to the agreements, reservations, or payments made outside the platform between users and businesses."
        },
        {
          title: "6. External Links",
          body:
            "The platform may contain links to other websites or platforms. TripShqip is not responsible for the content or services provided by third parties."
        },
        {
          title: "7. Intellectual Property",
          body:
            "The content, logo, design, and elements of the TripShqip platform are the property of TripShqip and may not be copied or used without permission."
        },
        {
          title: "8. Limitation of Liability",
          body:
            "TripShqip does not guarantee the absolute accuracy of every listing, the availability of services, or the quality of products or services offered by businesses. Use of the platform is at the user's own responsibility."
        },
        {
          title: "9. Changes to the Terms",
          body:
            "TripShqip reserves the right to update these terms at any time. Changes take effect upon publication on the platform."
        },
        {
          title: "10. Contact",
          body:
            "For any questions or requests regarding these Terms of Use, you can contact us through the \"Contact\" page."
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
      intro: "Mirë se vini në TripShqip. Duke përdorur platformën tonë, ju pranoni këto Kushte të Përdorimit. Ju lutemi lexojini me kujdes.",
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
        cancel: "Anulo",
        error: "Ndodhi një gabim",
        discard: "Anulo ndryshimet",
        on: "Aktiv",
        off: "Joaktiv",
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
      directions: "Drejtime",
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
    admin: {
      consoleTitle: "Konsola e Administratorit",
      heroTitle: "Kontrollo platformën turistike nga një vend.",
      addListing: "Shto listim",
      viewServices: "Shiko shërbimet",
      blogStudio: "Blog Studio",
      blogPublishTitle: "Publikoni përmbajtje blogu direkt nga admin",
      blogPublishDesc: "Shtoni udhëzues destinacioni, histori udhëtimi dhe përmbajtje editoriale pa u larguar nga paneli i kontrollit.",
      draftMode: "Mënyra Draft",
      chars: "Karaktere",
      posts: "Postime",
      coverImage: "URL e fotos së kopertinës",
      coverImagePlaceholder: "URL e fotos së kopertinës",
      publishImmediately: "Publiko menjëherë",
      publishPost: "Publiko postimin",
      saveDraft: "Ruaj draftin",
      addCityTitle: "Shto Qytet në Shqipëri (Admin)",
      addCityDesc: "Vetëm administratori mund të shtojë qytete të reja në Shqipëri. Ato shfaqen automatikisht në faqen kryesore dhe faqet e qyteteve.",
      cityNameLabel: "Emri i qytetit",
      cityNamePlaceholder: "p.sh. Himarë",
      regionLabel: "Rajoni",
      regionPlaceholder: "Bregdeti i Jugut",
      imageLabel: "URL e imazhit",
      descriptionLabel: "Përshkrimi",
      descriptionPlaceholder: "Përshkrim i shkurtër i qytetit",
      addCityBtn: "Shto qytetin",
      availableCitiesLabel: "Qytetet e disponueshme",
      deleteBtn: "Fshij",
      confirmDeleteCity: "A jeni i sigurt që dëshironi të fshini {label}?",
      deleteCityFailed: "Dështoi fshirja e qytetit",
      cityDeleted: "Qyteti u fshi.",
      deletedListingsSuffix: "listime.",
      cityAddedMessage: "Qyteti u shtua. Faqja kryesore dhe faqja e qytetit do të përditësohen automatikisht.",
      addCityFailed: "Dështoi shtimi i qytetit",
      profileSaved: "Profili u ruajt",
      resetSent: "Linku për ndryshim fjalëkalimi u dërgua në emailin tuaj",
      fullNameLabel: "Emri i plotë",
      emailLabel: "Adresa e email-it",
      passwordLabel: "Fjalëkalimi",
      passwordResetDesc: "Dërgo një link të sigurt për rivendosje në emailin tuaj.",
      resetPasswordBtn: "Rivendos Fjalëkalimin",
      saveProfileBtn: "Ruaj Profilin",
      navAdminLabel: "Admin",
      profileDataTitle: "Të dhënat",
      forgotPasswordTitle: "Fjalëkalimi",
      forgotPasswordDesc: "Dërgo një link të sigurt për rivendosje në emailin tuaj.",
      pwResetSubtitle: "Siguria e llogarisë",
      pwResetTip1: "Linku i rivendosjes skadon për 30 minuta",
      pwResetTip2: "Dërgohet vetëm te email-i juaj i verifikuar",
      pwResetTip3: "Fjalëkalimi juaj aktual mbetet aktiv derisa ta ndryshoni",
      identifiedAs: "I identifikuar si",
      pendingModeration: "Në pritje të moderimit",
      pendingCountText: "Ka {count} listime që presin miratimin tuaj.",
      approvalRateLabel: "Shkalla e miratimit",
      users: "Përdorues",
      listings: "Listingje",
      pending: "Në pritje",
      approved: "Të miratuara",
      reports: "Raporte",
      blogs: "Blogje",
      viewListings: "Shiko listimet",
      addCity: "Shto Qytet",
      addListingShort: "Shto listim",
      cities: "Qytete",
      cityStudio: "Studio e qyteteve",
      cityPublishTitle: "Shto një qytet të ri direkt nga admin",
      cityPublishDesc: "Krijo një destinacion me titull, përshkrim dhe foto banner. Qytetet e reja shfaqen në listën e qyteteve ku mund t'i modifikosh në çdo kohë.",
      cityDescPlaceholder: "Përshkrim i shkurtër që shfaqet në banner-in e qytetit...",
      bannerPhotoLabel: "Foto banner",
      bannerPhotoHint: "Për qytetin përdoret vetëm një foto banner.",
      chooseFile: "Zgjidh një foto",
      uploadBanner: "Ngarko banner",
      cityAdded: "Qyteti u shtua.",
      cityUpdated: "Banner-i i qytetit u përditësua.",
      cityBannerEditor: "Modifiko banner-at e qyteteve",
      editBanner: "Modifiko banner-in",
      saveChanges: "Ruaj ndryshimet",
      moderationQueue: "Radha e moderimit",
      pendingApprovals: "Shërbime në pritje për miratim",
      allCaughtUp: "Gjithçka në rregull",
      noPendingDesc: "Nuk ka shërbime në pritje për miratim për momentin.",
      verifiedLabel: "I verifikuar",
      unverifiedLabel: "I paverifikuar",
      invalidEmail: "Ju lutemi vendosni një adresë email-i të vlefshme.",
      resetConfirmTitle: "Konfirmo rivendosjen e fjalëkalimit",
      resetConfirmDesc: "Do të dërgojmë një link për rivendosjen e fjalëkalimit në emailin tuaj. Vazhdoni?",
      viewBtn: "Shiko",
      editBtn: "Modifiko",
      deleteListingBtn: "Fshi",
      confirmDeleteListing: "A jeni të sigurt që dëshironi të fshini shërbimin \"{title}\"?",
      listingDeleted: "Shërbimi u fshi me sukses!",
      deleteListingFailed: "Fshirja dështoi",
      deleteListingError: "Ndodhi një gabim gjatë fshirjes"
    }
    ,
    approveButton: "Prano",
    rejectButton: "Refuzo",
    listingApproved: "Listimi u pranua",
    listingRejected: "Listimi u refuzua"
    ,
    categories: {
      header: "Kategoria",
      description: "Zbuloni gamën e plotë të shërbimeve dhe përvojave nën {category}. Gjeni ofruesit më të mirë lokalë dhe rezervoni me besim."
      ,
      names: {
        akomodim: "Akomodim",
        restorante: "Restorante",
        atraksione: "Atraksione",
        evente: "Evente",
        "sherbime-turistike": "Shërbime Turistike",
        "produkte-lokale": "Produkte Lokale",
        transport: "Transport"
      },
      subnames: {
        akomodim: {
          hotel: "Hotel",
          resort: "Resort",
          vila: "Vila",
          apartament: "Apartament",
          guesthouse: "Guesthouse",
          "te-tjera": "Të tjera"
        },
        restorante: {
          tradicional: "Tradicional",
          internacional: "Internacional",
          "fast-food": "Fast Food",
          "kafe-bar": "Kafe & Bar",
          "te-tjera": "Të tjera"
        },
        atraksione: {
          natyre: "Natyrë",
          historike: "Historike",
          muze: "Muze",
          plazh: "Plazh",
          "te-tjera": "Të tjera"
        },
        evente: {
          koncerte: "Koncerte",
          festivale: "Festivale",
          panaire: "Panaire",
          dasma: "Dasma",
          "te-tjera": "Të tjera"
        },
        "sherbime-turistike": {
          guida: "Guida",
          agjenci: "Agjenci",
          ekskursione: "Ekskursione",
          rezervime: "Rezervime",
          "te-tjera": "Të tjera"
        },
        "produkte-lokale": {
          artizanat: "Artizanat",
          ushqimore: "Ushqimore",
          suvenire: "Suvenire",
          agro: "Agro-Produkte",
          "te-tjera": "Të tjera"
        },
        transport: {
          aeroport: "Aeroport",
          "makine-me-qira": "Makina me Qira",
          varka: "Varka",
          taksi: "Taksi",
          "te-tjera": "Të tjera"
        }
      }
    }
      ,
      terms: [
        {
          title: "1. Rreth TripShqip",
          body:
            "TripShqip është një platformë turistike që ndihmon përdoruesit të zbulojnë dhe kontaktojnë biznese, atraksione dhe shërbime turistike në Shqipëri. Platforma shërben si një hapësirë informuese dhe promovuese për bizneset dhe përdoruesit."
        },
        {
          title: "2. Përdorimi i Platformës",
          body:
            "Duke përdorur TripShqip, ju pranoni të: përdorni platformën në mënyrë të ligjshme, mos publikoni përmbajtje të rreme ose mashtruese, mos cenoni të drejtat e përdoruesve të tjerë, dhe mos përdorni platformën për spam ose aktivitete të paautorizuara."
        },
        {
          title: "3. Listing-et dhe Përmbajtja",
          body:
            "Bizneset janë përgjegjëse për saktësinë e informacionit që publikojnë, përfshirë përshkrimet, kontaktet, fotot, çmimet, linket dhe informacionet e tjera. TripShqip rezervon të drejtën të moderojë, ndryshojë, refuzojë ose heqë listing-e që konsiderohen të papërshtatshme, të pasakta ose në kundërshtim me këto kushte."
        },
        {
          title: "4. Verified, Ads, Ads Pro",
          body:
            "TripShqip mund të ofrojë opsione promocionale si Verified, Ads dhe Ads Pro. Këto opsione ofrojnë ekspozim më të madh për listing-et, por nuk garantojnë rezultate specifike apo rezervime."
        },
        {
          title: "5. Kontaktet dhe Rezervimet",
          body:
            "TripShqip mundëson kontakt direkt midis përdoruesve dhe bizneseve. TripShqip nuk është palë në marrëveshjet, rezervimet ose pagesat që realizohen jashtë platformës midis përdoruesve dhe bizneseve."
        },
        {
          title: "6. Linke të Jashtme",
          body:
            "Platforma mund të përmbajë linke drejt website-ve ose platformave të tjera. TripShqip nuk mban përgjegjësi për përmbajtjen ose shërbimet e ofruara nga palë të treta."
        },
        {
          title: "7. Pronësia Intelektuale",
          body:
            "Përmbajtja, logoja, dizajni dhe elementët e platformës TripShqip janë pronë e TripShqip dhe nuk mund të kopjohen ose përdoren pa leje."
        },
        {
          title: "8. Kufizimi i Përgjegjësisë",
          body:
            "TripShqip nuk garanton saktësinë absolute të çdo listing-u, disponueshmërinë e shërbimeve, apo cilësinë e produkteve ose shërbimeve të ofruara nga bizneset. Përdorimi i platformës bëhet me përgjegjësinë e vetë përdoruesit."
        },
        {
          title: "9. Ndryshimet në Kushtet",
          body:
            "TripShqip rezervon të drejtën të përditësojë këto kushte në çdo kohë. Ndryshimet hyjnë në fuqi pas publikimit në platformë."
        },
        {
          title: "10. Kontakt",
          body:
            "Për çdo pyetje ose kërkesë lidhur me këto Kushte të Përdorimit, mund të na kontaktoni përmes faqes “Kontakt”."
        }
      ]
  }
};
