import fs from "node:fs";
import mongoose from "mongoose";

const envText = fs.readFileSync(".env.local", "utf8");
for (const line of envText.split(/\r?\n/)) {
  const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
  if (match && !process.env[match[1]]) process.env[match[1]] = match[2].replace(/^['"]|['"]$/g, "");
}

// Populates the products/menu/rooms catalog for every demo listing that has one
// (seed-demo-listings.mjs creates the listings themselves, with no products), so
// every /listings/[slug] page renders the real grouped, imaged catalog UI instead
// of falling back to a flat, imageless list.
const FOOD_MENU = [
  { category: "Antipasta", items: [
    { name: "Byrek me Spinaq", description: "Byrek tradicional me spinaq dhe djathë", price: 350, image: "https://images.unsplash.com/photo-1541518763669-27fef04b14ea?auto=format&fit=crop&w=800&q=80" },
    { name: "Byrek me Mish", description: "Byrek i pjekur në furrë druri me mish të grirë", price: 400, image: "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?auto=format&fit=crop&w=800&q=80" },
    { name: "Sallatë Shqiptare", description: "Domate, kastravec, qepë, djathë feta dhe ullinj", price: 450, image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80" },
    { name: "Supë Koke", description: "Supë tradicionale me kokë vici, e shërbyer e ngrohtë", price: 500, image: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=80" },
    { name: "Fli me Kos", description: "Petë të holla të pjekura, të shërbyera me kos", price: 400, image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=800&q=80" }
  ]},
  { category: "Pjata Kryesore", items: [
    { name: "Tavë Kosi", description: "Mish qengji i pjekur me oriz dhe kos", price: 900, image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80" },
    { name: "Qofte të Fërguara", description: "Qofte shtëpie me erëza tradicionale, të shërbyera me patate", price: 700, image: "https://images.unsplash.com/photo-1529042410759-befb1204b468?auto=format&fit=crop&w=800&q=80" },
    { name: "Pulë në Skarë", description: "Gjoks pule i marinuar, i pjekur në skarë", price: 750, image: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?auto=format&fit=crop&w=800&q=80" },
    { name: "Fërgesë Tirane", description: "Piper, domate dhe djathë të skuqura, klasik tradicional", price: 650, image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80" },
    { name: "Peshk në Skarë", description: "Peshk i freskët i pjekur në skarë me limon", price: 1100, image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=800&q=80" }
  ]},
  { category: "Pije", items: [
    { name: "Lëng Portokalli", description: "I shtrydhur natyral, pa sheqer të shtuar", price: 250, image: "https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=800&q=80" },
    { name: "Kafe Ekspres", description: "Kafe italiane, e freskët e përgatitur", price: 150, image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80" },
    { name: "Çaj Mali", description: "Çaj bimor lokal, i shërbyer i ngrohtë", price: 150, image: "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?auto=format&fit=crop&w=800&q=80" },
    { name: "Ujë Mineral", description: "0.5L, gazuar ose jo", price: 100, image: "https://images.unsplash.com/photo-1560023907-5f339617ea30?auto=format&fit=crop&w=800&q=80" },
    { name: "Birrë Korça", description: "Birrë lokale 0.33L", price: 300, image: "https://images.unsplash.com/photo-1608270586620-248524c67de9?auto=format&fit=crop&w=800&q=80" }
  ]},
  { category: "Ëmbëlsira", items: [
    { name: "Bakllava", description: "Petë me arra dhe shurup mjalti", price: 350, image: "https://images.unsplash.com/photo-1519676867240-f03562e64548?auto=format&fit=crop&w=800&q=80" },
    { name: "Trilece", description: "Ëmbëlsirë e butë me tri lloje qumështi", price: 400, image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=800&q=80" },
    { name: "Revani", description: "Ëmbëlsirë tradicionale me shurup portokalli", price: 350, image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=800&q=80" },
    { name: "Krem Karamel", description: "Puding i butë vaniljeje me karamel", price: 380, image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=800&q=80" },
    { name: "Akullore Artizanale", description: "Dy topa, shije sipas ditës", price: 300, image: "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?auto=format&fit=crop&w=800&q=80" }
  ]}
];

const HOTEL_ROOMS = [
  { category: "Dhoma Standarde", items: [
    { name: "Dhomë Single", description: "Një krevat, banjo private, Wi-Fi falas", price: 4500, image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80" },
    { name: "Dhomë Double", description: "Krevat dopio, mëngjes i përfshirë", price: 6000, image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80" },
    { name: "Dhomë Twin", description: "Dy krevate teke, ideale për miq apo koleg", price: 6200, image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=80" }
  ]},
  { category: "Suite & Apartamente", items: [
    { name: "Suite Deluxe", description: "Sallon i veçantë, vaskë hidromasazhi, pamje panoramike", price: 9500, image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80" },
    { name: "Apartament Familjar", description: "Kuzhinë e vogël, dy dhoma gjumi, deri në 4 persona", price: 11000, image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80" }
  ]}
];

const SHOPPING = {
  "veshje": { label: "Veshje", groups: [
    { category: "Veshje Burrash", items: [
      { name: "Këmishë Oxford", description: "Pambuk 100%, prerje moderne", price: 3200, image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80" },
      { name: "Pantallona Jeans", description: "Denim i qëndrueshëm, model slim-fit", price: 4500, image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80" },
      { name: "Xhaketë Lëkure", description: "Lëkurë natyrale, linjë klasike", price: 12000, image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80" }
    ]},
    { category: "Veshje Grash", items: [
      { name: "Fustan Verë", description: "Pëlhurë e lehtë, model lulëzuar", price: 3800, image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80" },
      { name: "Bluzë Triko", description: "Triko i butë, ngjyra sezonale", price: 2600, image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=800&q=80" }
    ]}
  ]},
  "kepuce": { label: "Këpucë", groups: [
    { category: "Këpucë", items: [
      { name: "Sneakers Urban", description: "Komode për çdo ditë, disa numra në stok", price: 5500, image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80" },
      { name: "Këpucë Lëkure", description: "Model elegant për zyrë apo raste speciale", price: 7200, image: "https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=800&q=80" },
      { name: "Sandale Verë", description: "Të lehta, ideale për plazh apo qytet", price: 3200, image: "https://images.unsplash.com/photo-1603487742131-4160ec999306?auto=format&fit=crop&w=800&q=80" }
    ]},
    { category: "Çanta", items: [
      { name: "Çantë Shpine", description: "Kapacitet i madh, e përshtatshme për laptop", price: 4200, image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80" },
      { name: "Çantë Dore", description: "Model elegant, disa ngjyra në dispozicion", price: 5800, image: "https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=800&q=80" }
    ]}
  ]},
  "bizhuteri": { label: "Bizhuteri", groups: [
    { category: "Bizhuteri", items: [
      { name: "Byzylyk Argjendi", description: "Argjend 925, punim artizanal", price: 3500, image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80" },
      { name: "Vath Ari", description: "Ar 14K, model minimalist", price: 6800, image: "https://images.unsplash.com/photo-1602752275452-0e744f9a1c8c?auto=format&fit=crop&w=800&q=80" },
      { name: "Gjerdan Perla", description: "Perla natyrale, gjatësi rregullueshme", price: 5200, image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80" }
    ]},
    { category: "Aksesorë", items: [
      { name: "Orë Dore", description: "Kuarc zviceran, rrip lëkure", price: 9500, image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80" },
      { name: "Syze Dielli", description: "Mbrojtje UV400, kornizë e lehtë", price: 2800, image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80" }
    ]}
  ]},
  "kozmetike": { label: "Kozmetikë", groups: [
    { category: "Fytyrë", items: [
      { name: "Krem Hidratues", description: "Për çdo lloj lëkure, 50ml", price: 1800, image: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=800&q=80" },
      { name: "Serum Vitamin C", description: "Ndriçues, redukton njollat", price: 2400, image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80" },
      { name: "Set Make-up", description: "Fondacion, korrektor dhe pluhur", price: 3600, image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80" }
    ]},
    { category: "Parfume", items: [
      { name: "Parfum Femra", description: "Aromë lulesh, 50ml EDP", price: 4200, image: "https://images.unsplash.com/photo-1587017539504-67cfbddac569?auto=format&fit=crop&w=800&q=80" },
      { name: "Parfum Burra", description: "Aromë druri, 100ml EDT", price: 4500, image: "https://images.unsplash.com/photo-1615634260167-c8cdede054de?auto=format&fit=crop&w=800&q=80" }
    ]}
  ]},
  "elektronike": { label: "Elektronikë", groups: [
    { category: "Telefona & Tablet", items: [
      { name: "Smartphone X200", description: "128GB, kamera e dyfishtë", price: 45000, image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80" },
      { name: "Tablet 10\"", description: "Ekran HD, bateri me qëndrueshmëri të lartë", price: 28000, image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80" }
    ]},
    { category: "Aksesorë", items: [
      { name: "Kufje Bluetooth", description: "Cilësi zëri e lartë, deri 20 orë baterie", price: 6500, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80" },
      { name: "Karikues Wireless", description: "15W, i përshtatshëm për shumicën e telefonave", price: 2200, image: "https://images.unsplash.com/photo-1591290619762-c8e3e2791a3b?auto=format&fit=crop&w=800&q=80" },
      { name: "Smartwatch Pro", description: "Monitorim shëndeti, rezistent ndaj ujit", price: 12000, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80" }
    ]}
  ]}
};

const SUPERMARKET = {
  "supermarkete": { groups: [
    { category: "Ushqimore", items: [
      { name: "Vaj Ulliri 1L", description: "Ulli i shtrydhur në Shqipëri", price: 900, image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80" },
      { name: "Miell Gruri 1kg", description: "Miell i bardhë për brumë", price: 150, image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80" },
      { name: "Sheqer 1kg", description: "Sheqer i bardhë kristal", price: 130, image: "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&w=800&q=80" }
    ]},
    { category: "Pije", items: [
      { name: "Ujë Mineral 6x1.5L", description: "Paketë 6 shishe", price: 480, image: "https://images.unsplash.com/photo-1560023907-5f339617ea30?auto=format&fit=crop&w=800&q=80" },
      { name: "Lëng Frutash 1L", description: "Portokall ose pjeshkë", price: 250, image: "https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=800&q=80" }
    ]}
  ]},
  "minimarkete": { groups: [
    { category: "Ushqimore", items: [
      { name: "Bukë e Freskët", description: "E pjekur çdo mëngjes", price: 80, image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80" },
      { name: "Qumësht 1L", description: "Pasterizuar, i freskët", price: 140, image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=800&q=80" },
      { name: "Vezë (10 copë)", description: "Nga fermat lokale", price: 220, image: "https://images.unsplash.com/photo-1518569656558-1f25e69d93d7?auto=format&fit=crop&w=800&q=80" }
    ]},
    { category: "Higjienë", items: [
      { name: "Sapun Dushi", description: "500ml, për çdo lloj lëkure", price: 380, image: "https://images.unsplash.com/photo-1584305574647-0cc949a2bb9f?auto=format&fit=crop&w=800&q=80" },
      { name: "Letra Higjenike (8 rul.)", description: "Të buta, me 3 shtresa", price: 320, image: "https://images.unsplash.com/photo-1584556812952-905ffd0c611a?auto=format&fit=crop&w=800&q=80" }
    ]}
  ]},
  "produkte-ushqimore": { groups: [
    { category: "Bulmet", items: [
      { name: "Djathë i Bardhë", description: "500g, prodhim shtëpie", price: 600, image: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&w=800&q=80" },
      { name: "Kos Shtëpie", description: "1kg, pa aditivë", price: 350, image: "https://images.unsplash.com/photo-1571212515416-fef01fc43637?auto=format&fit=crop&w=800&q=80" },
      { name: "Gjalpë Natyral", description: "250g, prej qumështi lope", price: 420, image: "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=800&q=80" }
    ]},
    { category: "Fruta & Zarzavate", items: [
      { name: "Domate Fresh", description: "1kg, prodhim vendi", price: 180, image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80" },
      { name: "Mollë", description: "1kg, të kuqe e të ëmbla", price: 160, image: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=800&q=80" }
    ]}
  ]},
  "produkte-bio": { groups: [
    { category: "Produkte Bio", items: [
      { name: "Mjaltë Bio", description: "500g, nga bletët e malit", price: 900, image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80" },
      { name: "Vezë Organike (6 copë)", description: "Nga pula të rritura në natyrë", price: 250, image: "https://images.unsplash.com/photo-1518569656558-1f25e69d93d7?auto=format&fit=crop&w=800&q=80" },
      { name: "Perime Bio Mix", description: "1kg, pa pesticide", price: 320, image: "https://images.unsplash.com/photo-1518843875459-f738682238a6?auto=format&fit=crop&w=800&q=80" }
    ]},
    { category: "Drithëra & Fara", items: [
      { name: "Bollgur Organik", description: "500g, burim fibrash", price: 280, image: "https://images.unsplash.com/photo-1517686748843-bb360cd85c67?auto=format&fit=crop&w=800&q=80" },
      { name: "Fara Lini", description: "250g, të pasura me Omega-3", price: 350, image: "https://images.unsplash.com/photo-1595475207225-428b62bda831?auto=format&fit=crop&w=800&q=80" }
    ]}
  ]},
  "pije": { groups: [
    { category: "Pije Freskuese", items: [
      { name: "Coca-Cola 1.5L", description: "Shishe plastike", price: 220, image: "https://images.unsplash.com/photo-1554866585-cd94860890b7?auto=format&fit=crop&w=800&q=80" },
      { name: "Lëng Portokalli 1L", description: "100% natyral", price: 260, image: "https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=800&q=80" },
      { name: "Ujë me Gaz 0.5L", description: "Freskues, pako 6 copë", price: 300, image: "https://images.unsplash.com/photo-1560023907-5f339617ea30?auto=format&fit=crop&w=800&q=80" }
    ]},
    { category: "Verë & Birrë", items: [
      { name: "Verë e Kuqe Vendi", description: "750ml, prodhim lokal", price: 1200, image: "https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?auto=format&fit=crop&w=800&q=80" },
      { name: "Birrë Korça (6x0.33L)", description: "Pako 6 shishe", price: 900, image: "https://images.unsplash.com/photo-1608270586620-248524c67de9?auto=format&fit=crop&w=800&q=80" }
    ]}
  ]}
};

const HOME_BUILD = {
  "mobilim": { groups: [
    { category: "Dhomë Ndenjeje", items: [
      { name: "Divan 3-Vendesh", description: "Pëlhurë e qëndrueshme, disa ngjyra", price: 45000, image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80" },
      { name: "Tavolinë Kafeje", description: "Dru masiv, dizajn modern", price: 12000, image: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=800&q=80" }
    ]},
    { category: "Dhomë Gjumi", items: [
      { name: "Krevat Queen", description: "160x200cm, me kornizë dërrase", price: 32000, image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80" },
      { name: "Dollap Rrobash", description: "3 porta, hapësirë e madhe", price: 28000, image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=800&q=80" },
      { name: "Komodinë", description: "Sirtar dhe raft, dru natyral", price: 6500, image: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=800&q=80" }
    ]}
  ]},
  "elektroshtepiake": { groups: [
    { category: "Kuzhinë", items: [
      { name: "Frigorifer 2-Deri", description: "No-frost, klasë energjitike A+", price: 68000, image: "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?auto=format&fit=crop&w=800&q=80" },
      { name: "Furrë Mikrovalë", description: "25L, me grill", price: 12000, image: "https://images.unsplash.com/photo-1585659722983-3a675dabf23d?auto=format&fit=crop&w=800&q=80" }
    ]},
    { category: "Larje", items: [
      { name: "Makinë Larëse 8kg", description: "1200 rrotullime/min", price: 55000, image: "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=800&q=80" },
      { name: "Aspirator Kuzhine", description: "Fuqi e lartë thithjeje, i heshtur", price: 15000, image: "https://images.unsplash.com/photo-1556909212-d5b604d0c90d?auto=format&fit=crop&w=800&q=80" },
      { name: "Blender Profesional", description: "1000W, 6 thika inox", price: 8500, image: "https://images.unsplash.com/photo-1570222094114-d054a817e56b?auto=format&fit=crop&w=800&q=80" }
    ]}
  ]},
  "materiale-ndertimi": { groups: [
    { category: "Materiale", items: [
      { name: "Çimento 50kg", description: "Klasë e lartë, për çdo lloj ndërtimi", price: 950, image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=800&q=80" },
      { name: "Tullë Blloku", description: "Paketë 50 copë", price: 4200, image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?auto=format&fit=crop&w=800&q=80" }
    ]},
    { category: "Hidrosanitare", items: [
      { name: "Tub PVC 1\"", description: "3 metra, presion i lartë", price: 650, image: "https://images.unsplash.com/photo-1620641622519-3d54c2b7c5c8?auto=format&fit=crop&w=800&q=80" },
      { name: "Rubinet Kuzhine", description: "Krom, me spirale", price: 3800, image: "https://images.unsplash.com/photo-1584622781867-1c5fce7a1f7f?auto=format&fit=crop&w=800&q=80" },
      { name: "Bojë Muri 15L", description: "Lavabile, mat", price: 5200, image: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=800&q=80" }
    ]}
  ]},
  "kuzhina": { groups: [
    { category: "Elementë Kuzhine", items: [
      { name: "Kuzhinë e Plotë L-Shape", description: "Me plan pune granit dhe rafte", price: 180000, image: "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=800&q=80" },
      { name: "Lavaman Inox", description: "Dy vaska, me bateri të përfshirë", price: 9500, image: "https://images.unsplash.com/photo-1556909172-54557c7e4fb7?auto=format&fit=crop&w=800&q=80" }
    ]},
    { category: "Pajisje", items: [
      { name: "Plan Pune Granit", description: "Me metër, ngjyra sipas zgjedhjes", price: 4500, image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=800&q=80" },
      { name: "Rafte Kuzhine", description: "Alumini, montim i shpejtë", price: 3200, image: "https://images.unsplash.com/photo-1556909190-eccf4a8bf97a?auto=format&fit=crop&w=800&q=80" }
    ]}
  ]},
  "dyer-dritare": { groups: [
    { category: "Dyer", items: [
      { name: "Derë Hyrëse Blindate", description: "Siguri e lartë, izolim akustik", price: 42000, image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80" },
      { name: "Derë e Brendshme", description: "MDF e lyer, disa ngjyra", price: 9500, image: "https://images.unsplash.com/photo-1517581177682-a085bb7ffb15?auto=format&fit=crop&w=800&q=80" }
    ]},
    { category: "Dritare", items: [
      { name: "Dritare PVC", description: "Xham dopio, izolim termik", price: 15000, image: "https://images.unsplash.com/photo-1509644851169-2acc08aa25b5?auto=format&fit=crop&w=800&q=80" },
      { name: "Dritare Alumini", description: "Model modern, hapje e lehtë", price: 18000, image: "https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=800&q=80" },
      { name: "Grilë Dielli", description: "Rregullim manual, mbrojtje nga rrezet", price: 6200, image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=800&q=80" }
    ]}
  ]}
};

const PETS = {
  "pet-shop": { groups: [
    { category: "Ushqim", items: [
      { name: "Ushqim Qeni 10kg", description: "Racion i plotë, të gjitha racat", price: 3800, image: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=800&q=80" },
      { name: "Ushqim Mace 5kg", description: "Me pulë, pa drithëra", price: 2600, image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=800&q=80" }
    ]},
    { category: "Aksesorë", items: [
      { name: "Shtrojë Gjumi", description: "E lavashme, madhësi M", price: 1800, image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=800&q=80" },
      { name: "Lodra Qeni", description: "Gomë e qëndrueshme, jo-toksike", price: 800, image: "https://images.unsplash.com/photo-1544568100-847a948585b9?auto=format&fit=crop&w=800&q=80" },
      { name: "Tasë Ushqimi Dopio", description: "Inox, i qëndrueshëm", price: 950, image: "https://images.unsplash.com/photo-1585846888147-3d3d1c1cd0d5?auto=format&fit=crop&w=800&q=80" }
    ]}
  ]},
  "veteriner": { groups: [
    { category: "Kontrolle", items: [
      { name: "Kontroll i Përgjithshëm", description: "Ekzaminim i plotë shëndetësor", price: 2000, image: "https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?auto=format&fit=crop&w=800&q=80" },
      { name: "Konsultë Urgjente", description: "Vlerësim i shpejtë rasti urgjent", price: 2500, image: "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=800&q=80" }
    ]},
    { category: "Vaksinim", items: [
      { name: "Vaksinë Rabies", description: "Doza vjetore, certifikatë e përfshirë", price: 1800, image: "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?auto=format&fit=crop&w=800&q=80" },
      { name: "Vaksinë Trivalente", description: "Mbrojtje kundër virozave kryesore", price: 2200, image: "https://images.unsplash.com/photo-1591946614720-90a587da4a36?auto=format&fit=crop&w=800&q=80" }
    ]}
  ]},
  "grooming": { groups: [
    { category: "Larje & Krehje", items: [
      { name: "Larje e Plotë", description: "Shampo profesionale, tharje me fryrje", price: 1800, image: "https://images.unsplash.com/photo-1541599468348-e96984315921?auto=format&fit=crop&w=800&q=80" },
      { name: "Krehje & Prerje Qime", description: "Sipas racës dhe gjatësisë së qimeve", price: 2500, image: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=800&q=80" }
    ]},
    { category: "Kujdes Shtesë", items: [
      { name: "Prerje Thonjsh", description: "E shpejtë dhe pa stres për kafshën", price: 500, image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=800&q=80" },
      { name: "Pastrim Veshësh", description: "Higjienë dhe kontroll infeksioni", price: 600, image: "https://images.unsplash.com/photo-1591160690555-5debfba289f0?auto=format&fit=crop&w=800&q=80" }
    ]}
  ]}
};

const LISTING_PLANS = [
  // Ushqim & Pije — 5 general restaurants, same style menu.
  { slug: "demo-ushqim-pije-1", menu: FOOD_MENU },
  { slug: "demo-ushqim-pije-2", menu: FOOD_MENU },
  { slug: "demo-ushqim-pije-3", menu: FOOD_MENU },
  { slug: "demo-ushqim-pije-4", menu: FOOD_MENU },
  { slug: "demo-ushqim-pije-5", menu: FOOD_MENU },
  // Hotele & Akomodim — rooms through the same catalog.
  { slug: "demo-hotele-1", menu: HOTEL_ROOMS },
  { slug: "demo-hotele-2", menu: HOTEL_ROOMS },
  { slug: "demo-hotele-3", menu: HOTEL_ROOMS },
  { slug: "demo-hotele-4", menu: HOTEL_ROOMS },
  { slug: "demo-hotele-5", menu: HOTEL_ROOMS },
  // Shopping — each demo listing keeps its own seeded subcategory's products.
  { slug: "demo-shopping-1", menu: SHOPPING["veshje"].groups },
  { slug: "demo-shopping-2", menu: SHOPPING["kepuce"].groups },
  { slug: "demo-shopping-3", menu: SHOPPING["bizhuteri"].groups },
  { slug: "demo-shopping-4", menu: SHOPPING["kozmetike"].groups },
  { slug: "demo-shopping-5", menu: SHOPPING["elektronike"].groups },
  // Supermarkete
  { slug: "demo-supermarkete-1", menu: SUPERMARKET["supermarkete"].groups },
  { slug: "demo-supermarkete-2", menu: SUPERMARKET["minimarkete"].groups },
  { slug: "demo-supermarkete-3", menu: SUPERMARKET["produkte-ushqimore"].groups },
  { slug: "demo-supermarkete-4", menu: SUPERMARKET["produkte-bio"].groups },
  { slug: "demo-supermarkete-5", menu: SUPERMARKET["pije"].groups },
  // Shtëpi & Ndërtim
  { slug: "demo-shtepi-ndertim-1", menu: HOME_BUILD["mobilim"].groups },
  { slug: "demo-shtepi-ndertim-2", menu: HOME_BUILD["elektroshtepiake"].groups },
  { slug: "demo-shtepi-ndertim-3", menu: HOME_BUILD["materiale-ndertimi"].groups },
  { slug: "demo-shtepi-ndertim-4", menu: HOME_BUILD["kuzhina"].groups },
  { slug: "demo-shtepi-ndertim-5", menu: HOME_BUILD["dyer-dritare"].groups },
  // Kafshë Shtëpiake
  { slug: "demo-kafshe-1", menu: PETS["pet-shop"].groups },
  { slug: "demo-kafshe-2", menu: PETS["veteriner"].groups },
  { slug: "demo-kafshe-3", menu: PETS["grooming"].groups },
  { slug: "demo-kafshe-4", menu: PETS["pet-shop"].groups },
  { slug: "demo-kafshe-5", menu: PETS["veteriner"].groups }
];

const listingSchema = new mongoose.Schema({}, { strict: false });
const productSchema = new mongoose.Schema({}, { strict: false });
const Listing = mongoose.models.DemoListing || mongoose.model("DemoListing", listingSchema, "listings");
const Product = mongoose.models.DemoProduct || mongoose.model("DemoProduct", productSchema, "products");

if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI is missing in .env.local");
await mongoose.connect(process.env.MONGODB_URI);

let totalCreated = 0;
let skipped = 0;
for (const plan of LISTING_PLANS) {
  const listing = await Listing.findOne({ slug: plan.slug });
  if (!listing) {
    console.warn(`Skipping ${plan.slug} — listing not found (run seed-demo-listings.mjs first).`);
    skipped += 1;
    continue;
  }

  let order = 0;
  let created = 0;
  for (const section of plan.menu) {
    for (const item of section.items) {
      await Product.updateOne(
        { listing: listing._id, name: item.name },
        { $set: {
          listing: listing._id, owner: listing.owner,
          name: item.name, description: item.description, price: item.price, image: item.image,
          menuCategory: section.category, available: true, order
        } },
        { upsert: true }
      );
      order += 1;
      created += 1;
    }
  }
  totalCreated += created;
  console.log(`Seeded ${created} products for "${listing.title}" (${plan.slug}).`);
}

console.log(`Done. ${totalCreated} products across ${LISTING_PLANS.length - skipped} listings (${skipped} skipped).`);
await mongoose.disconnect();
