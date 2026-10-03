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

const BEAUTY = {
  "parukeri": { groups: [
    { category: "Flokë Grash", items: [
      { name: "Prerje & Styling", description: "Prerje sipas formës së fytyrës dhe stilim final", price: 1500, image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=800&q=80" },
      { name: "Ngjyrim Flokësh", description: "Ngjyrë e plotë ose balayage, me produkte profesionale", price: 3500, image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37a?auto=format&fit=crop&w=800&q=80" }
    ]},
    { category: "Flokë Burrash", items: [
      { name: "Prerje Klasike", description: "Prerje me makinë dhe gërshërë", price: 800, image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80" },
      { name: "Trajtim Mjekre", description: "Formësim dhe trajtim mjekre me vaj", price: 600, image: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=800&q=80" }
    ]}
  ]},
  "berber": { groups: [
    { category: "Prerje", items: [
      { name: "Prerje Standarde", description: "Prerje e plotë, larje dhe stilim", price: 700, image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80" },
      { name: "Prerje + Mjekër", description: "Prerje flokësh dhe formësim mjekre", price: 1000, image: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=800&q=80" }
    ]},
    { category: "Trajtime", items: [
      { name: "Trajtim Flokësh", description: "Maskë ushqyese për flokë të thatë", price: 1200, image: "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=800&q=80" },
      { name: "Masazh Kokë", description: "Masazh relaksues 15 minuta", price: 500, image: "https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&w=800&q=80" }
    ]}
  ]},
  "spa": { groups: [
    { category: "Masazhe", items: [
      { name: "Masazh Relaksues 60min", description: "Masazh i plotë trupi me vajra aromatikë", price: 3500, image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=80" },
      { name: "Masazh me Gurë të Nxehtë", description: "Teknikë relaksuese me gurë bazalti", price: 4500, image: "https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&w=800&q=80" }
    ]},
    { category: "Trajtime Trupi", items: [
      { name: "Peeling Trupi", description: "Pastrim dhe ripërtëritje e lëkurës", price: 3000, image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80" },
      { name: "Aromaterapi", description: "Seancë relaksimi me vajra esenciale", price: 2800, image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80" }
    ]}
  ]},
  "estetike": { groups: [
    { category: "Fytyrë", items: [
      { name: "Pastrim i Thellë i Fytyrës", description: "Pastrim profesional me ekstraktim", price: 2500, image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80" },
      { name: "Trajtim Anti-Age", description: "Seancë me serum dhe masazh facial", price: 4000, image: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&w=800&q=80" }
    ]},
    { category: "Epilim", items: [
      { name: "Epilim me Laser (zonë e vogël)", description: "Epilim permanent, seancë e vetme", price: 2000, image: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&w=800&q=80" },
      { name: "Qerasje me Dyll (këmbë)", description: "Heqje qimesh me dyll të ngrohtë", price: 1500, image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80" }
    ]}
  ]},
  "thonj": { groups: [
    { category: "Manikyr", items: [
      { name: "Manikyr Klasik", description: "Formësim, kutikula dhe llak normal", price: 800, image: "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&w=800&q=80" },
      { name: "Manikyr me Xhel", description: "Xhel me qëndrueshmëri deri 3 javë", price: 1800, image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=800&q=80" }
    ]},
    { category: "Pedikyr", items: [
      { name: "Pedikyr Klasik", description: "Pastrim, formësim dhe llak", price: 1000, image: "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&w=800&q=80" },
      { name: "Pedikyr Spa", description: "Banjë këmbësh, peeling dhe masazh", price: 2200, image: "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&w=800&q=80" }
    ]}
  ]}
};

const HEALTH = {
  "klinika": { groups: [
    { category: "Konsulta", items: [
      { name: "Konsultë e Përgjithshme", description: "Vizitë me mjek të përgjithshëm", price: 2500, image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80" },
      { name: "Konsultë Pediatrike", description: "Vizitë për fëmijë me pediatër", price: 2800, image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80" }
    ]},
    { category: "Analiza", items: [
      { name: "Analiza Gjaku Bazë", description: "Hemogram i plotë", price: 1800, image: "https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=800&q=80" },
      { name: "Check-up i Plotë", description: "Panel i gjerë analizash dhe konsultë", price: 6500, image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80" }
    ]}
  ]},
  "dentiste": { groups: [
    { category: "Kontrolle", items: [
      { name: "Kontroll & Pastrim Dhëmbësh", description: "Pastrim profesional dhe kontroll goje", price: 3000, image: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=800&q=80" },
      { name: "Mbushje Dhëmbi", description: "Mbushje me kompozit estetik", price: 4500, image: "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?auto=format&fit=crop&w=800&q=80" }
    ]},
    { category: "Estetikë Dentare", items: [
      { name: "Zbardhim Dhëmbësh", description: "Seancë zbardhimi profesional", price: 8000, image: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=800&q=80" },
      { name: "Vendosje Fasetash (copë)", description: "Faseta porcelani për çdo dhëmb", price: 15000, image: "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?auto=format&fit=crop&w=800&q=80" }
    ]}
  ]},
  "laboratore": { groups: [
    { category: "Analiza Standarde", items: [
      { name: "Analiza e Gjakut", description: "Hemogram dhe biokimi bazë", price: 1500, image: "https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=800&q=80" },
      { name: "Analiza e Urinës", description: "Ekzaminim i plotë urine", price: 800, image: "https://images.unsplash.com/photo-1579165466949-3180a3d056d5?auto=format&fit=crop&w=800&q=80" }
    ]},
    { category: "Analiza të Specializuara", items: [
      { name: "Panel Hormonal", description: "Testim i niveleve hormonale", price: 4500, image: "https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=800&q=80" },
      { name: "Test Alergjie", description: "Panel alergjenësh të zakonshëm", price: 5000, image: "https://images.unsplash.com/photo-1579165466949-3180a3d056d5?auto=format&fit=crop&w=800&q=80" }
    ]}
  ]},
  "fizioterapi": { groups: [
    { category: "Seanca", items: [
      { name: "Seancë Fizioterapie 45min", description: "Terapi manuale dhe ushtrime", price: 2500, image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80" },
      { name: "Masazh Terapeutik", description: "Masazh për dhimbje muskulore", price: 2000, image: "https://images.unsplash.com/photo-1591741535018-d042766c62eb?auto=format&fit=crop&w=800&q=80" }
    ]},
    { category: "Programe", items: [
      { name: "Program Rehabilitimi (5 seanca)", description: "Program i plotë pas dëmtimi", price: 10000, image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80" },
      { name: "Vlerësim Fillestar", description: "Diagnostikim dhe plan trajtimi", price: 1500, image: "https://images.unsplash.com/photo-1591741535018-d042766c62eb?auto=format&fit=crop&w=800&q=80" }
    ]}
  ]},
  "okuliste": { groups: [
    { category: "Kontrolle Syri", items: [
      { name: "Kontroll i Plotë i Shikimit", description: "Ekzaminim i plotë oftalmologjik", price: 2000, image: "https://images.unsplash.com/photo-1577401239170-897942555fb3?auto=format&fit=crop&w=800&q=80" },
      { name: "Matje për Syze", description: "Matje precize e numrit të syzeve", price: 1000, image: "https://images.unsplash.com/photo-1577401159480-14b96db2ee04?auto=format&fit=crop&w=800&q=80" }
    ]},
    { category: "Produkte Optike", items: [
      { name: "Lente Optike Standarde", description: "Lente me montim të përfshirë", price: 3500, image: "https://images.unsplash.com/photo-1577401239170-897942555fb3?auto=format&fit=crop&w=800&q=80" },
      { name: "Lente Kontakti (çift)", description: "Lente mujore, çdo numër", price: 2500, image: "https://images.unsplash.com/photo-1577401159480-14b96db2ee04?auto=format&fit=crop&w=800&q=80" }
    ]}
  ]}
};

const AUTO = {
  "rent-a-car": { groups: [
    { category: "Makina Ekonomike", items: [
      { name: "Qira Ditore - Hatchback", description: "Makinë ekonomike, klimë, 5 vende", price: 4000, image: "https://images.unsplash.com/photo-1494905998402-395d579af36f?auto=format&fit=crop&w=800&q=80" },
      { name: "Qira Ditore - Sedan", description: "Komode për udhëtime të gjata", price: 5000, image: "https://images.unsplash.com/photo-1494905998402-395d579af36f?auto=format&fit=crop&w=800&q=80" }
    ]},
    { category: "Makina Premium", items: [
      { name: "Qira Ditore - SUV", description: "Hapësirë e madhe, 4x4 opsional", price: 8000, image: "https://images.unsplash.com/photo-1562141961-3a1f6c88e0cb?auto=format&fit=crop&w=800&q=80" },
      { name: "Qira Ditore - Luxury", description: "Makinë klase të lartë me shofer opsional", price: 15000, image: "https://images.unsplash.com/photo-1562141961-3a1f6c88e0cb?auto=format&fit=crop&w=800&q=80" }
    ]}
  ]},
  "servis": { groups: [
    { category: "Mirëmbajtje", items: [
      { name: "Ndërrim Vaji & Filtri", description: "Vaj sintetik dhe filtër origjinal", price: 2500, image: "https://images.unsplash.com/photo-1632823469850-1b7b1557cdb3?auto=format&fit=crop&w=800&q=80" },
      { name: "Diagnostikim Kompjuterik", description: "Skanim i plotë i gabimeve", price: 1500, image: "https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=800&q=80" }
    ]},
    { category: "Riparime", items: [
      { name: "Riparim Frenash (çift)", description: "Ndërrim disqe dhe ferrodo", price: 4500, image: "https://images.unsplash.com/photo-1632823469850-1b7b1557cdb3?auto=format&fit=crop&w=800&q=80" },
      { name: "Servis Motori", description: "Kontroll dhe riparim i plotë motori", price: 8000, image: "https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=800&q=80" }
    ]}
  ]},
  "lavazh": { groups: [
    { category: "Larje", items: [
      { name: "Larje e Jashtme", description: "Larje dhe fshesë e karrocerisë", price: 500, image: "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?auto=format&fit=crop&w=800&q=80" },
      { name: "Larje e Plotë (Brenda+Jashtë)", description: "Larje, fshesë dhe pastrim interior", price: 1200, image: "https://images.unsplash.com/photo-1605164599901-db2c37427f9b?auto=format&fit=crop&w=800&q=80" }
    ]},
    { category: "Trajtime", items: [
      { name: "Polirim Karrocerie", description: "Heqje gërvishtjesh të vogla", price: 5000, image: "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?auto=format&fit=crop&w=800&q=80" },
      { name: "Trajtim me Qelq (Nano)", description: "Mbrojtje afatgjatë e bojës", price: 12000, image: "https://images.unsplash.com/photo-1605164599901-db2c37427f9b?auto=format&fit=crop&w=800&q=80" }
    ]}
  ]},
  "gomisteri": { groups: [
    { category: "Shërbime Gomash", items: [
      { name: "Montim/Çmontim Gome (copë)", description: "Montim i shpejtë në vend", price: 300, image: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=800&q=80" },
      { name: "Balancim Rrotash (4 copë)", description: "Balancim elektronik i plotë", price: 1200, image: "https://images.unsplash.com/photo-1486326658194-fd4e3057c06b?auto=format&fit=crop&w=800&q=80" }
    ]},
    { category: "Goma", items: [
      { name: "Gomë Vere (copë)", description: "Markë e njohur, çdo madhësi", price: 6000, image: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=800&q=80" },
      { name: "Gomë Dimri (copë)", description: "Qëndrueshmëri në kushte të ftohta", price: 7000, image: "https://images.unsplash.com/photo-1486326658194-fd4e3057c06b?auto=format&fit=crop&w=800&q=80" }
    ]}
  ]},
  "auto-salon": { groups: [
    { category: "Makina në Shitje", items: [
      { name: "Sedan i Përdorur 2018", description: "Kontrolluar plotësisht, çdo detaj i verifikuar", price: 1200000, image: "https://images.unsplash.com/photo-1562141961-3a1f6c88e0cb?auto=format&fit=crop&w=800&q=80" },
      { name: "SUV i Përdorur 2020", description: "Kilometrazh i ulët, histori e pastër", price: 2200000, image: "https://images.unsplash.com/photo-1494905998402-395d579af36f?auto=format&fit=crop&w=800&q=80" }
    ]},
    { category: "Pjesë Këmbimi", items: [
      { name: "Bateri Makine", description: "Garanci 2 vjet, montim falas", price: 8000, image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=800&q=80" },
      { name: "Set Frenash i Plotë", description: "Disqe dhe ferrodo origjinale", price: 6000, image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=800&q=80" }
    ]}
  ]}
};

const HOME_SERVICES = {
  "hidraulik": { groups: [
    { category: "Riparime", items: [
      { name: "Riparim Rrjedhje Uji", description: "Diagnostikim dhe riparim i shpejtë", price: 1500, image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80" },
      { name: "Zbllokim Kanalizimesh", description: "Me pajisje profesionale", price: 2000, image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?auto=format&fit=crop&w=800&q=80" }
    ]},
    { category: "Instalime", items: [
      { name: "Instalim Rubineti", description: "Montim dhe vendosje e re", price: 1000, image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80" },
      { name: "Instalim Boiler", description: "Montim i plotë me lidhje ujësjellësi", price: 3500, image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?auto=format&fit=crop&w=800&q=80" }
    ]}
  ]},
  "elektricist": { groups: [
    { category: "Riparime", items: [
      { name: "Riparim Qark Elektrik", description: "Diagnostikim dhe riparim i sigurt", price: 1500, image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=800&q=80" },
      { name: "Ndërrim Prizash (copë)", description: "Priza të reja standarde", price: 500, image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=800&q=80" }
    ]},
    { category: "Instalime", items: [
      { name: "Instalim Panel Elektrik", description: "Montim tabloje me siguresa", price: 6000, image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=800&q=80" },
      { name: "Instalim Llambadarë", description: "Montim dhe lidhje elektrike", price: 1200, image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=800&q=80" }
    ]}
  ]},
  "bojaxhi": { groups: [
    { category: "Lyerje", items: [
      { name: "Lyerje Dhome (m²)", description: "Bojë lavabile, dy dorë", price: 300, image: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=800&q=80" },
      { name: "Lyerje Fasade (m²)", description: "Bojë rezistente ndaj motit", price: 450, image: "https://images.unsplash.com/photo-1562184552-997c461abbe6?auto=format&fit=crop&w=800&q=80" }
    ]},
    { category: "Rifiniturë", items: [
      { name: "Suvatim Muri (m²)", description: "Rifiniturë e lëmuar para lyerjes", price: 500, image: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=800&q=80" },
      { name: "Tapiceri Muri", description: "Vendosje tapicerie dekorative", price: 2500, image: "https://images.unsplash.com/photo-1562184552-997c461abbe6?auto=format&fit=crop&w=800&q=80" }
    ]}
  ]},
  "pastrim": { groups: [
    { category: "Pastrim Shtëpie", items: [
      { name: "Pastrim i Plotë Apartamenti", description: "Pastrim i detajuar në çdo dhomë", price: 3500, image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80" },
      { name: "Pastrim Pas Rinovimi", description: "Heqje pluhuri dhe mbetjesh ndërtimi", price: 6000, image: "https://images.unsplash.com/photo-1581579438747-104c53d7fbc4?auto=format&fit=crop&w=800&q=80" }
    ]},
    { category: "Shërbime Shtesë", items: [
      { name: "Pastrim Qilimash (m²)", description: "Pastrim i thellë me pajisje profesionale", price: 300, image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80" },
      { name: "Pastrim Xhamash", description: "Xhama të pastër pa shenja", price: 1500, image: "https://images.unsplash.com/photo-1581579438747-104c53d7fbc4?auto=format&fit=crop&w=800&q=80" }
    ]}
  ]},
  "kondicionere": { groups: [
    { category: "Instalim", items: [
      { name: "Instalim Kondicioneri", description: "Montim i plotë, brenda dhe jashtë", price: 4000, image: "https://images.unsplash.com/photo-1631545806609-c2b6e4f4e3a4?auto=format&fit=crop&w=800&q=80" },
      { name: "Shërbim Mirëmbajtjeje", description: "Pastrim filtrash dhe kontroll gazi", price: 2000, image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=800&q=80" }
    ]},
    { category: "Riparime", items: [
      { name: "Rimbushje Gazi Freon", description: "Rimbushje e plotë me gaz freon", price: 3000, image: "https://images.unsplash.com/photo-1631545806609-c2b6e4f4e3a4?auto=format&fit=crop&w=800&q=80" },
      { name: "Riparim Kompresori", description: "Diagnostikim dhe riparim i njësisë së jashtme", price: 5000, image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=800&q=80" }
    ]}
  ]}
};

const PROFESSIONAL = {
  "avokat": { groups: [
    { category: "Konsulta", items: [
      { name: "Konsultë Juridike (orë)", description: "Këshillim mbi rastin konkret", price: 3000, image: "https://images.unsplash.com/photo-1589391886645-d51941baf7fb?auto=format&fit=crop&w=800&q=80" },
      { name: "Hartim Kontrate", description: "Kontratë e personalizuar sipas rastit", price: 5000, image: "https://images.unsplash.com/photo-1560439514-4e9645039924?auto=format&fit=crop&w=800&q=80" }
    ]},
    { category: "Përfaqësim", items: [
      { name: "Përfaqësim në Gjyq (seancë)", description: "Përfaqësim i plotë ligjor", price: 15000, image: "https://images.unsplash.com/photo-1589391886645-d51941baf7fb?auto=format&fit=crop&w=800&q=80" },
      { name: "Dosje Divorci", description: "Përgatitje dhe ndjekje e plotë", price: 25000, image: "https://images.unsplash.com/photo-1560439514-4e9645039924?auto=format&fit=crop&w=800&q=80" }
    ]}
  ]},
  "noter": { groups: [
    { category: "Noterizime", items: [
      { name: "Noterizim Dokumenti", description: "Noterizim i thjeshtë dokumenti", price: 1000, image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=800&q=80" },
      { name: "Kontratë Shitje-Blerje", description: "Hartim dhe noterizim i plotë", price: 8000, image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=800&q=80" }
    ]},
    { category: "Vërtetime", items: [
      { name: "Vërtetim Firme", description: "Vërtetim firme mbi dokument", price: 500, image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=800&q=80" },
      { name: "Fuqi Prokure", description: "Hartim dhe noterizim prokure", price: 3000, image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=800&q=80" }
    ]}
  ]},
  "kontabilist": { groups: [
    { category: "Kontabilitet", items: [
      { name: "Kontabilitet Mujor (Biznes i Vogël)", description: "Mbajtje e plotë e librave", price: 8000, image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80" },
      { name: "Deklarim TVSH", description: "Përgatitje dhe depozitim mujor", price: 3000, image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=800&q=80" }
    ]},
    { category: "Konsulencë", items: [
      { name: "Konsulencë Fiskale (orë)", description: "Këshillim për optimizim fiskal", price: 2500, image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80" },
      { name: "Hapje Biznesi", description: "Regjistrim i plotë pranë QKB", price: 15000, image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=800&q=80" }
    ]}
  ]},
  "marketing": { groups: [
    { category: "Social Media", items: [
      { name: "Menaxhim Social Media (muaj)", description: "Plan përmbajtjeje dhe postime javore", price: 15000, image: "https://images.unsplash.com/photo-1557838923-2985c318be48?auto=format&fit=crop&w=800&q=80" },
      { name: "Fushatë Reklamash", description: "Krijim dhe menaxhim fushate Meta/Google", price: 10000, image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80" }
    ]},
    { category: "Përmbajtje", items: [
      { name: "Fotografi Produkti (10 copë)", description: "Foto profesionale për dyqan online", price: 5000, image: "https://images.unsplash.com/photo-1557838923-2985c318be48?auto=format&fit=crop&w=800&q=80" },
      { name: "Video Promocionale", description: "Video e shkurtër për rrjete sociale", price: 20000, image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80" }
    ]}
  ]},
  "it": { groups: [
    { category: "Web", items: [
      { name: "Krijim Website Bazik", description: "Faqe prezantuese, deri 5 faqe", price: 25000, image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80" },
      { name: "Mirëmbajtje Website (muaj)", description: "Përditësime dhe monitorim sigurie", price: 5000, image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=80" }
    ]},
    { category: "Software", items: [
      { name: "Zhvillim Aplikacioni (orë)", description: "Zhvillim i personalizuar sipas kërkesës", price: 3000, image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80" },
      { name: "Konsulencë IT (orë)", description: "Këshillim teknik për biznesin", price: 2500, image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=80" }
    ]}
  ]}
};

const EVENTS = {
  "salla-eventesh": { groups: [
    { category: "Paketa Sallash", items: [
      { name: "Paketë Dasme (deri 100 vetë)", description: "Sallë, tavolina dhe shërbim i plotë", price: 150000, image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80" },
      { name: "Paketë Ditëlindjeje", description: "Sallë e dekoruar deri 50 vetë", price: 50000, image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=800&q=80" }
    ]},
    { category: "Shtesa", items: [
      { name: "Dekor Bazik", description: "Dekor tavolinash dhe skene", price: 15000, image: "https://images.unsplash.com/photo-1478146059778-26028b07395a?auto=format&fit=crop&w=800&q=80" },
      { name: "Qira Tendë e Jashtme", description: "Tendë për eventet në natyrë", price: 20000, image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80" }
    ]}
  ]},
  "fotograf": { groups: [
    { category: "Paketa Foto", items: [
      { name: "Paketë Fotografie Dasme", description: "Mbulim i plotë i ditës, album i përfshirë", price: 40000, image: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?auto=format&fit=crop&w=800&q=80" },
      { name: "Session Fotografik Çift", description: "1 orë session para dasmës", price: 8000, image: "https://images.unsplash.com/photo-1554048612-b6a482bc67e5?auto=format&fit=crop&w=800&q=80" }
    ]},
    { category: "Shtesa", items: [
      { name: "Album Fotografik", description: "Album i shtypur, 30 faqe", price: 6000, image: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?auto=format&fit=crop&w=800&q=80" },
      { name: "Foto Drone", description: "Pamje ajrore të eventit", price: 5000, image: "https://images.unsplash.com/photo-1554048612-b6a482bc67e5?auto=format&fit=crop&w=800&q=80" }
    ]}
  ]},
  "videograf": { groups: [
    { category: "Paketa Video", items: [
      { name: "Video Dasme (Full Day)", description: "Mbulim video i gjithë ditës", price: 50000, image: "https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=800&q=80" },
      { name: "Video Highlight (3-5min)", description: "Montim i shkurtër emocional", price: 15000, image: "https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=800&q=80" }
    ]},
    { category: "Shtesa", items: [
      { name: "Video me Drone", description: "Pamje ajrore shtesë për montim", price: 7000, image: "https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=800&q=80" },
      { name: "Montim Shtesë", description: "Version i zgjatur i videos", price: 5000, image: "https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=800&q=80" }
    ]}
  ]},
  "dj": { groups: [
    { category: "Paketa Muzike", items: [
      { name: "DJ + Sistem Zëri (4 orë)", description: "Muzikë e personalizuar sipas kërkesës", price: 25000, image: "https://images.unsplash.com/photo-1571266028243-d220c6a3c7c6?auto=format&fit=crop&w=800&q=80" },
      { name: "DJ + Drita (6 orë)", description: "Paketë e plotë me efekte drite", price: 35000, image: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?auto=format&fit=crop&w=800&q=80" }
    ]},
    { category: "Shtesa", items: [
      { name: "Orë Shtesë", description: "Zgjatje e eventit përtej paketës", price: 4000, image: "https://images.unsplash.com/photo-1571266028243-d220c6a3c7c6?auto=format&fit=crop&w=800&q=80" },
      { name: "MC/Prezantues", description: "Prezantim dhe koordinim programi", price: 8000, image: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?auto=format&fit=crop&w=800&q=80" }
    ]}
  ]},
  "dekor": { groups: [
    { category: "Dekor Dasme", items: [
      { name: "Dekor Tavoline (për tavolinë)", description: "Qendra lulesh dhe rroba tavoline", price: 2500, image: "https://images.unsplash.com/photo-1478146059778-26028b07395a?auto=format&fit=crop&w=800&q=80" },
      { name: "Hark Lulesh", description: "Hark dekorativ për ceremoni", price: 12000, image: "https://images.unsplash.com/photo-1478146896981-b80fe463b330?auto=format&fit=crop&w=800&q=80" }
    ]},
    { category: "Dekor Eventesh", items: [
      { name: "Balona & Dekor Ditëlindjeje", description: "Dekor i plotë me tema sipas kërkesës", price: 8000, image: "https://images.unsplash.com/photo-1478146896981-b80fe463b330?auto=format&fit=crop&w=800&q=80" },
      { name: "Qendra Fotografike (Backdrop)", description: "Backdrop i dekoruar për foto", price: 10000, image: "https://images.unsplash.com/photo-1478146059778-26028b07395a?auto=format&fit=crop&w=800&q=80" }
    ]}
  ]}
};

const TOURISM = {
  "agjenci-turistike": { groups: [
    { category: "Paketa", items: [
      { name: "Paketë Fundjave (2 ditë)", description: "Transport, akomodim dhe mëngjes i përfshirë", price: 12000, image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80" },
      { name: "Paketë Plazh (3 net)", description: "Hotel buzë detit, transport i përfshirë", price: 25000, image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80" }
    ]},
    { category: "Shtesa", items: [
      { name: "Transport Aeroport", description: "Transfer privat vajtje-ardhje", price: 2000, image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80" },
      { name: "Sigurim Udhëtimi", description: "Mbulim mjekësor për udhëtimin", price: 1500, image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80" }
    ]}
  ]},
  "guida": { groups: [
    { category: "Ture me Guidë", items: [
      { name: "Guidë Gjysmëditore", description: "Shëtitje e udhëhequr 3-4 orë", price: 4000, image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80" },
      { name: "Guidë Ditore e Plotë", description: "Program i plotë, 8 orë", price: 7000, image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80" }
    ]},
    { category: "Shtesa", items: [
      { name: "Guidë në Gjuhë të Huaj", description: "Anglisht, italisht ose gjermanisht", price: 2000, image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80" },
      { name: "Transport i Përfshirë", description: "Transport privat gjatë turit", price: 3000, image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80" }
    ]}
  ]},
  "ture": { groups: [
    { category: "Ture Ditore", items: [
      { name: "Tur Kulturor Ditor", description: "Vizitë vendesh historike me guidë", price: 3500, image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80" },
      { name: "Tur Gastronomik", description: "Shijim specialitetesh lokale", price: 4500, image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80" }
    ]},
    { category: "Ture me Varkë", items: [
      { name: "Tur me Varkë (2 orë)", description: "Shëtitje buzë bregdetit", price: 3000, image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80" },
      { name: "Tur me Varkë Private", description: "Varkë private deri 6 persona", price: 8000, image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80" }
    ]}
  ]},
  "aktivitete": { groups: [
    { category: "Natyrë", items: [
      { name: "Hyrje Parku Natyror", description: "Biletë hyrjeje ditore", price: 500, image: "https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=800&q=80" },
      { name: "Vizitë e Udhëhequr Muze", description: "Biletë + guidë brenda muzeut", price: 300, image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80" }
    ]},
    { category: "Aktivitete Familjare", items: [
      { name: "Qira Çadër Plazhi", description: "Çadër + 2 shezlongë, ditë e plotë", price: 1000, image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80" },
      { name: "Lundrim me Kajak", description: "1 orë qira kajak, pajisje të përfshira", price: 1500, image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80" }
    ]}
  ]},
  "sporte-aventure": { groups: [
    { category: "Hiking & Trekking", items: [
      { name: "Hiking i Udhëhequr (gjysmëditor)", description: "Shëtitje malore me guidë lokale", price: 3000, image: "https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=800&q=80" },
      { name: "Trek Alpin (ditor)", description: "Udhëtim i plotë ditor në male", price: 6000, image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?auto=format&fit=crop&w=800&q=80" }
    ]},
    { category: "Sporte Uji", items: [
      { name: "Zhytje me Maskë (Snorkeling)", description: "Pajisje të përfshira, guidë në ujë", price: 2500, image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80" },
      { name: "Rafting (2 orë)", description: "Aventurë në lumë me instruktor", price: 5000, image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?auto=format&fit=crop&w=800&q=80" }
    ]}
  ]}
};

const EDUCATION = {
  "kurse-digital": { groups: [
    { category: "Kurse Kompjuteri", items: [
      { name: "Kurs Bazik Kompjuteri (muaj)", description: "Nga zero, me çertifikatë përfundimi", price: 6000, image: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&w=800&q=80" },
      { name: "Kurs Excel i Avancuar", description: "Formula, pivot tabela dhe analizë", price: 8000, image: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&w=800&q=80" }
    ]},
    { category: "Kurse Krijuese", items: [
      { name: "Kurs Fotografie", description: "Bazat e kompozimit dhe dritës", price: 7000, image: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?auto=format&fit=crop&w=800&q=80" },
      { name: "Kurs Dizajni Grafik", description: "Photoshop dhe Illustrator për fillestarë", price: 9000, image: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&w=800&q=80" }
    ]}
  ]},
  "gjuhe-huaja": { groups: [
    { category: "Gjuhë", items: [
      { name: "Kurs Anglisht (nivel bazë, muaj)", description: "Grupe të vogla, materiale të përfshira", price: 6000, image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=800&q=80" },
      { name: "Kurs Italisht (muaj)", description: "Fokus në bisedë dhe gramatikë", price: 6000, image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=800&q=80" }
    ]},
    { category: "Përgatitje Provimesh", items: [
      { name: "Përgatitje IELTS", description: "Paketë 10 seancash intensive", price: 10000, image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=800&q=80" },
      { name: "Bisedë Praktike (orë)", description: "Seancë bisede me mësues nativ", price: 1500, image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=800&q=80" }
    ]}
  ]},
  "trajnime": { groups: [
    { category: "Trajnime Profesionale", items: [
      { name: "Trajnim Menaxhim Projekti", description: "Metodologji dhe raste praktike", price: 15000, image: "https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=800&q=80" },
      { name: "Trajnim Shitje & Marketing", description: "Teknika praktike shitjeje", price: 12000, image: "https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=800&q=80" }
    ]},
    { category: "Workshope", items: [
      { name: "Workshop 1-Ditor", description: "Seancë intensive me certifikatë", price: 5000, image: "https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=800&q=80" },
      { name: "Seminar Online", description: "Pjesëmarrje live nga distanca", price: 3000, image: "https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=800&q=80" }
    ]}
  ]},
  "mesim-privat": { groups: [
    { category: "Mësim Privat", items: [
      { name: "Orë Private Matematikë", description: "Orë individuale, çdo nivel", price: 1000, image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80" },
      { name: "Orë Private Fizikë", description: "Përgatitje për provime shkollore", price: 1000, image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80" }
    ]},
    { category: "Përgatitje Provimesh", items: [
      { name: "Përgatitje Maturë (paketë 10 orë)", description: "Program intensiv përpara provimit", price: 9000, image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80" },
      { name: "Ndihmë Detyrash (orë)", description: "Mbështetje javore me detyrat e shtëpisë", price: 800, image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80" }
    ]}
  ]},
  "arte": { groups: [
    { category: "Arte", items: [
      { name: "Kurs Piano (muaj)", description: "Nga bazat, çdo moshë", price: 7000, image: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?auto=format&fit=crop&w=800&q=80" },
      { name: "Kurs Kitarë (muaj)", description: "Akorde bazë dhe repertor", price: 6500, image: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?auto=format&fit=crop&w=800&q=80" }
    ]},
    { category: "Vallëzim", items: [
      { name: "Kurs Vallëzimi (muaj)", description: "Grupe sipas nivelit", price: 5500, image: "https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?auto=format&fit=crop&w=800&q=80" },
      { name: "Orë Private Vallëzimi", description: "Orë individuale ose për çift", price: 1500, image: "https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?auto=format&fit=crop&w=800&q=80" }
    ]}
  ]}
};

const FITNESS = {
  "palester": { groups: [
    { category: "Abonime", items: [
      { name: "Abonim Mujor", description: "Akses i plotë në palestër", price: 3500, image: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=800&q=80" },
      { name: "Abonim Vjetor", description: "12 muaj, me çmim të reduktuar", price: 30000, image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80" }
    ]},
    { category: "Trajnim Personal", items: [
      { name: "Seancë Trajner Personal", description: "Program i personalizuar", price: 2000, image: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=800&q=80" },
      { name: "Paketë 10 Seanca PT", description: "Me ndjekje progresi", price: 17000, image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80" }
    ]}
  ]},
  "yoga": { groups: [
    { category: "Klasa Yoga", items: [
      { name: "Klasë Yoga (e vetme)", description: "Klasë grupi, çdo nivel", price: 800, image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80" },
      { name: "Abonim Mujor Yoga", description: "Akses i pakufizuar në klasa", price: 6000, image: "https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?auto=format&fit=crop&w=800&q=80" }
    ]},
    { category: "Seanca Private", items: [
      { name: "Seancë Private Yoga", description: "Seancë individuale me instruktor", price: 2500, image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80" },
      { name: "Yoga për Fëmijë (klasë)", description: "Klasë e përshtatur për fëmijë", price: 600, image: "https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?auto=format&fit=crop&w=800&q=80" }
    ]}
  ]},
  "pilates": { groups: [
    { category: "Klasa Pilates", items: [
      { name: "Klasë Pilates (e vetme)", description: "Klasë grupi me mat", price: 900, image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80" },
      { name: "Abonim Mujor Pilates", description: "Klasa të pakufizuara", price: 6500, image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80" }
    ]},
    { category: "Reformer", items: [
      { name: "Seancë Reformer Pilates", description: "Seancë me pajisje reformer", price: 2000, image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80" },
      { name: "Paketë 5 Seanca Reformer", description: "Me ulje çmimi për paketë", price: 9000, image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80" }
    ]}
  ]},
  "pishine": { groups: [
    { category: "Hyrje", items: [
      { name: "Hyrje Ditore në Pishinë", description: "Akses i plotë për një ditë", price: 500, image: "https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&w=800&q=80" },
      { name: "Abonim Mujor Pishinë", description: "Hyrje e pakufizuar një muaj", price: 5000, image: "https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&w=800&q=80" }
    ]},
    { category: "Mësim Not", items: [
      { name: "Orë Mësim Not (fëmijë)", description: "Instruktor i certifikuar", price: 1500, image: "https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&w=800&q=80" },
      { name: "Orë Mësim Not (të rritur)", description: "Teknikë bazë e notit", price: 1800, image: "https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&w=800&q=80" }
    ]}
  ]},
  "tenis": { groups: [
    { category: "Rezervim Fushe", items: [
      { name: "Orë Fushë Tenisi", description: "Rezervim 1 orë, çdo kohë", price: 1500, image: "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&w=800&q=80" },
      { name: "Orë Fushë Padel", description: "Rezervim 1 orë fushë padel", price: 2000, image: "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&w=800&q=80" }
    ]},
    { category: "Mësim", items: [
      { name: "Orë Private Tenisi", description: "Me trajner të kualifikuar", price: 2500, image: "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&w=800&q=80" },
      { name: "Paketë 5 Orë Mësim", description: "Me ndjekje progresi teknik", price: 11000, image: "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&w=800&q=80" }
    ]}
  ]}
};

const INDUSTRY = {
  "materiale-ndertimi": { groups: [
    { category: "Materiale Bazë", items: [
      { name: "Çimento me Shumicë (ton)", description: "Çmim me shumicë, dërgesë e përfshirë", price: 18000, image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=800&q=80" },
      { name: "Hekur Betoni (ton)", description: "Diametra të ndryshëm në stok", price: 120000, image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?auto=format&fit=crop&w=800&q=80" }
    ]},
    { category: "Inerte", items: [
      { name: "Zhavorr (m³)", description: "Dërgesë me kamion deri në vend", price: 1500, image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?auto=format&fit=crop&w=800&q=80" },
      { name: "Rërë (m³)", description: "Rërë e larë për ndërtim", price: 1200, image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=800&q=80" }
    ]}
  ]},
  "pajisje-profesionale": { groups: [
    { category: "Pajisje Hoteleri", items: [
      { name: "Frigorifer Industrial", description: "Kapacitet i madh, klasë energjitike A", price: 180000, image: "https://images.unsplash.com/photo-1565514020179-026b92b2d70b?auto=format&fit=crop&w=800&q=80" },
      { name: "Furrë Profesionale", description: "Furrë konvekcioni për restorante", price: 220000, image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=800&q=80" }
    ]},
    { category: "Pajisje Zyre", items: [
      { name: "Fotokopjuese Profesionale", description: "Shpejtësi e lartë, shumëfunksionale", price: 90000, image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=800&q=80" },
      { name: "Printer Industrial", description: "Për vëllim të lartë printimi", price: 60000, image: "https://images.unsplash.com/photo-1565514020179-026b92b2d70b?auto=format&fit=crop&w=800&q=80" }
    ]}
  ]},
  "prodhues": { groups: [
    { category: "Prodhim me Shumicë", items: [
      { name: "Prodhim Paketimesh (1000 copë)", description: "Paketim i personalizuar sipas porosisë", price: 25000, image: "https://images.unsplash.com/photo-1565514020179-026b92b2d70b?auto=format&fit=crop&w=800&q=80" },
      { name: "Prodhim Etiketash (5000 copë)", description: "Etiketa të printuara sipas dizajnit tuaj", price: 8000, image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=800&q=80" }
    ]},
    { category: "Shërbime Prodhimi", items: [
      { name: "Prerje Metali me Lazer (m)", description: "Precizion i lartë për çdo material", price: 500, image: "https://images.unsplash.com/photo-1565514020179-026b92b2d70b?auto=format&fit=crop&w=800&q=80" },
      { name: "Montim me Porosi", description: "Montim sipas specifikimeve tuaja", price: 10000, image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=800&q=80" }
    ]}
  ]},
  "shitje-shumice": { groups: [
    { category: "Shumicë Ushqimore", items: [
      { name: "Vaj Ulliri me Shumicë (18L)", description: "Çmim i veçantë për sasi të mëdha", price: 9000, image: "https://images.unsplash.com/photo-1553413077-190883911c9b?auto=format&fit=crop&w=800&q=80" },
      { name: "Miell me Shumicë (50kg)", description: "Çantë e madhe, dërgesë e përfshirë", price: 3500, image: "https://images.unsplash.com/photo-1553413077-190883911c9b?auto=format&fit=crop&w=800&q=80" }
    ]},
    { category: "Shumicë Paketimesh", items: [
      { name: "Kuti Kartoni (100 copë)", description: "Madhësi standarde, qëndrueshmëri e lartë", price: 6000, image: "https://images.unsplash.com/photo-1553413077-190883911c9b?auto=format&fit=crop&w=800&q=80" },
      { name: "Qese Plastike (1000 copë)", description: "Madhësi të ndryshme në dispozicion", price: 4000, image: "https://images.unsplash.com/photo-1553413077-190883911c9b?auto=format&fit=crop&w=800&q=80" }
    ]}
  ]},
  "makineri": { groups: [
    { category: "Makineri Ndërtimi", items: [
      { name: "Qira Ekskavatori (ditë)", description: "Me operator, gati për punë", price: 25000, image: "https://images.unsplash.com/photo-1581093458791-9d42e3c7e117?auto=format&fit=crop&w=800&q=80" },
      { name: "Qira Autobetonierë (ditë)", description: "Transport betoni deri në vend", price: 20000, image: "https://images.unsplash.com/photo-1581094651181-35942459ef62?auto=format&fit=crop&w=800&q=80" }
    ]},
    { category: "Makineri të Vogla", items: [
      { name: "Qira Gjenerator (ditë)", description: "Fuqi e mjaftueshme për kantier të vogël", price: 3000, image: "https://images.unsplash.com/photo-1581093458791-9d42e3c7e117?auto=format&fit=crop&w=800&q=80" },
      { name: "Qira Kompresor Ajri (ditë)", description: "Për vegla pneumatike", price: 2500, image: "https://images.unsplash.com/photo-1581094651181-35942459ef62?auto=format&fit=crop&w=800&q=80" }
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
  { slug: "demo-kafshe-5", menu: PETS["veteriner"].groups },
  // Bukuri & Wellness
  { slug: "demo-bukuri-1", menu: BEAUTY["parukeri"].groups },
  { slug: "demo-bukuri-2", menu: BEAUTY["berber"].groups },
  { slug: "demo-bukuri-3", menu: BEAUTY["spa"].groups },
  { slug: "demo-bukuri-4", menu: BEAUTY["estetike"].groups },
  { slug: "demo-bukuri-5", menu: BEAUTY["thonj"].groups },
  // Shëndet
  { slug: "demo-shendet-1", menu: HEALTH["klinika"].groups },
  { slug: "demo-shendet-2", menu: HEALTH["dentiste"].groups },
  { slug: "demo-shendet-3", menu: HEALTH["laboratore"].groups },
  { slug: "demo-shendet-4", menu: HEALTH["fizioterapi"].groups },
  { slug: "demo-shendet-5", menu: HEALTH["okuliste"].groups },
  // Automjete
  { slug: "demo-auto-1", menu: AUTO["rent-a-car"].groups },
  { slug: "demo-auto-2", menu: AUTO["servis"].groups },
  { slug: "demo-auto-3", menu: AUTO["lavazh"].groups },
  { slug: "demo-auto-4", menu: AUTO["gomisteri"].groups },
  { slug: "demo-auto-5", menu: AUTO["auto-salon"].groups },
  // Shërbime për Shtëpinë
  { slug: "demo-sherbime-shtepi-1", menu: HOME_SERVICES["hidraulik"].groups },
  { slug: "demo-sherbime-shtepi-2", menu: HOME_SERVICES["elektricist"].groups },
  { slug: "demo-sherbime-shtepi-3", menu: HOME_SERVICES["bojaxhi"].groups },
  { slug: "demo-sherbime-shtepi-4", menu: HOME_SERVICES["pastrim"].groups },
  { slug: "demo-sherbime-shtepi-5", menu: HOME_SERVICES["kondicionere"].groups },
  // Shërbime Profesionale
  { slug: "demo-sherbime-profesionale-1", menu: PROFESSIONAL["avokat"].groups },
  { slug: "demo-sherbime-profesionale-2", menu: PROFESSIONAL["noter"].groups },
  { slug: "demo-sherbime-profesionale-3", menu: PROFESSIONAL["kontabilist"].groups },
  { slug: "demo-sherbime-profesionale-4", menu: PROFESSIONAL["marketing"].groups },
  { slug: "demo-sherbime-profesionale-5", menu: PROFESSIONAL["it"].groups },
  // Evente & Dasma
  { slug: "demo-evente-1", menu: EVENTS["salla-eventesh"].groups },
  { slug: "demo-evente-2", menu: EVENTS["fotograf"].groups },
  { slug: "demo-evente-3", menu: EVENTS["videograf"].groups },
  { slug: "demo-evente-4", menu: EVENTS["dj"].groups },
  { slug: "demo-evente-5", menu: EVENTS["dekor"].groups },
  // Turizëm & Aktivitete
  { slug: "demo-turizem-1", menu: TOURISM["agjenci-turistike"].groups },
  { slug: "demo-turizem-2", menu: TOURISM["guida"].groups },
  { slug: "demo-turizem-3", menu: TOURISM["ture"].groups },
  { slug: "demo-turizem-4", menu: TOURISM["aktivitete"].groups },
  { slug: "demo-turizem-5", menu: TOURISM["sporte-aventure"].groups },
  // Arsim & Trajnime
  { slug: "demo-arsim-1", menu: EDUCATION["kurse-digital"].groups },
  { slug: "demo-arsim-2", menu: EDUCATION["gjuhe-huaja"].groups },
  { slug: "demo-arsim-3", menu: EDUCATION["trajnime"].groups },
  { slug: "demo-arsim-4", menu: EDUCATION["mesim-privat"].groups },
  { slug: "demo-arsim-5", menu: EDUCATION["arte"].groups },
  // Sport & Fitness
  { slug: "demo-sport-fitness-1", menu: FITNESS["palester"].groups },
  { slug: "demo-sport-fitness-2", menu: FITNESS["yoga"].groups },
  { slug: "demo-sport-fitness-3", menu: FITNESS["pilates"].groups },
  { slug: "demo-sport-fitness-4", menu: FITNESS["pishine"].groups },
  { slug: "demo-sport-fitness-5", menu: FITNESS["tenis"].groups },
  // Biznese & Industri
  { slug: "demo-biznese-industri-1", menu: INDUSTRY["materiale-ndertimi"].groups },
  { slug: "demo-biznese-industri-2", menu: INDUSTRY["pajisje-profesionale"].groups },
  { slug: "demo-biznese-industri-3", menu: INDUSTRY["prodhues"].groups },
  { slug: "demo-biznese-industri-4", menu: INDUSTRY["shitje-shumice"].groups },
  { slug: "demo-biznese-industri-5", menu: INDUSTRY["makineri"].groups }
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
