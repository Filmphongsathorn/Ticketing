import MockAdapter from 'axios-mock-adapter';
import api from './api';

// Create a mock adapter instance with a 800ms delay to simulate realistic network latency
const mock = new MockAdapter(api, { delayResponse: 800 });

// ─── DUMMY DATA ──────────────────────────────────────────────────────────────
const dummyEvents = [
  {
    id: "evt_1",
    name: "Cyberpunk Symphony 2077",
    artist: "The Synthwave Orchestra",
    description: "Experience the ultimate fusion of classical orchestra and futuristic synthwave in an immersive audio-visual spectacular.",
    fullDescription: "เตรียมตัวโยกให้มันส์ทะลุโลก! กับ 'Cyberpunk Symphony 2077' 🎵✨\n\nพบกับการผสมผสานที่ลงตัวที่สุดระหว่างวงออร์เคสตราคลาสสิกระดับโลก และดนตรีซินธ์เวฟล้ำยุค ที่จะพาคุณข้ามเวลาไปยังปี 2077 สัมผัสประสบการณ์แสง สี เสียง ที่จะกระชากวิญญาณคุณออกจากร่าง!\n\nไฮไลท์ของงาน:\n🔥 เวทีแบบ 360 องศา พร้อมระบบ Hologram อิมเมอร์ซีฟสุดล้ำ\n🔥 ระบบเสียง Spatial Audio ขับกล่อมโดยวงออร์เคสตรากว่า 80 ชีวิต\n🔥 Visual Effects ที่จะทำให้คุณรู้สึกเหมือนหลุดเข้าไปอยู่ในโลกไซเบอร์พังค์\n\nอย่าพลาดโอกาสสำคัญที่คุณจะได้สัมผัสโลกอนาคตผ่านเสียงดนตรี จองบัตรล่วงหน้า (Early Bird) วันนี้รับทันทีโปสเตอร์ลิมิเต็ดอิดิชั่นที่มีเพียง 1,000 ใบในโลกเท่านั้น!",
    eventDate: new Date(Date.now() + 86400000 * 14).toISOString(),
    minPrice: 350000,
    imageUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=2000",
    venue: { name: "Neon Arena", city: "Bangkok" },
    genres: ["Orchestral", "Synthwave", "Electronic"],
    artists: [
      { name: "The Synthwave Orchestra", image: "https://picsum.photos/seed/synthwave/200/200" },
      { name: "DJ Neon", image: "https://ui-avatars.com/api/?name=DJ+Neon&background=random&color=fff&size=150" }
    ],
    organizer: { name: "Future Beats Co.", image: "https://ui-avatars.com/api/?name=Future+Beats&background=random&color=fff&size=150" },
    sessions: [
      { id: "s1", displayDate: "Friday, June 18", displayTime: "19:00 - 23:00" },
      { id: "s2", displayDate: "Saturday, June 19", displayTime: "19:00 - 23:00" }
    ]
  },
  {
    id: "evt_2",
    name: "Summer Vibes Festival",
    artist: "Various Artists",
    description: "The biggest outdoor music festival of the year. Three stages, over 50 artists, and endless summer memories.",
    fullDescription: "ร้อนนี้จะลุกเป็นไฟ! กับ 'Summer Vibes Festival' 🏖️🔥\n\nเตรียมตัวสัมผัสลมทะเลและเสียงคลื่น พร้อมกับศิลปินกว่า 50 ชีวิตที่จะมาสาดความมันส์ให้หาดทรายสะเทือน! งานเทศกาลดนตรีกลางแจ้งที่ยิ่งใหญ่ที่สุดแห่งปีบนหาดพัทยา ที่จะเปลี่ยนวันธรรมดาของคุณให้กลายเป็นปาร์ตี้ริมหาดที่ไม่มีวันลืม\n\nความพิเศษภายในงาน:\n🌴 3 เวทีหลัก (Main Stage, Indie Stage, DJ Tent) ให้คุณเลือกมันส์ได้ตามสไตล์\n🌴 โซน Food Truck รวบรวมร้านอาหารชื่อดังกว่า 100 ร้าน\n🌴 โซนกิจกรรมทางน้ำและจุดถ่ายรูปสุดชิคที่ออกแบบมาเพื่อชาว Social โดยเฉพาะ\n🌴 ปิดท้ายด้วยโชว์พลุสุดตระการตาริมหาดในยามค่ำคืน\n\nเตรียมนัดเพื่อนให้พร้อม แล้วมาสร้างความทรงจำดีๆ ในหน้าร้อนนี้ด้วยกัน!",
    eventDate: new Date(Date.now() + 86400000 * 30).toISOString(),
    minPrice: 280000,
    imageUrl: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&q=80&w=2000",
    venue: { name: "Sunset Beach Park", city: "Pattaya" },
    genres: ["Pop", "Rock", "Indie"],
    artists: [
      { name: "Polycat", image: "https://ui-avatars.com/api/?name=Polycat&background=0D8ABC&color=fff&size=150" },
      { name: "Tilly Birds", image: "https://ui-avatars.com/api/?name=Tilly+Birds&background=F59E0B&color=fff&size=150" },
      { name: "Three Man Down", image: "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?auto=format&fit=crop&q=80&w=150" }
    ],
    organizer: { name: "BeachFest Thailand", image: "https://picsum.photos/seed/beachfest/200/200" },
    sessions: [
      { id: "s1", displayDate: "Sat, July 04", displayTime: "15:00 - 23:59" }
    ]
  },
  {
    id: "evt_3",
    name: "Unplugged & Intimate",
    artist: "Acoustic Legends",
    description: "An exclusive, intimate acoustic set featuring legendary rock ballads stripped down to their rawest form.",
    fullDescription: "สัมผัสความอบอุ่นใกล้ชิดกับ 'Unplugged & Intimate' 🎸🍂\n\nคอนเสิร์ตอะคูสติกสุดพิเศษที่คุณจะได้ฟังเพลงร็อคบัลลาดระดับตำนานในเวอร์ชันที่บริสุทธิ์และลึกซึ้งที่สุด จัดในบรรยากาศโรงละครหรูหราคลาสสิก ที่ให้ความรู้สึกอบอุ่นเหมือนศิลปินมาร้องเพลงให้ฟังแบบ Exclusive ถึงที่บ้าน\n\nสิ่งที่คุณจะได้รับในงาน:\n🍷 เครื่องดื่ม Welcome Drink ระดับพรีเมียม\n🍷 การจัดที่นั่งแบบโซฟา VIP ที่ให้ความสะดวกสบายขั้นสุด\n🍷 โอกาสพูดคุยและถ่ายรูปกับศิลปินอย่างใกล้ชิดหลังจบการแสดง\n\nที่นั่งจำกัดเพียง 500 ที่นั่งเท่านั้น เพื่อรักษาบรรยากาศความ Intimate ให้ดีที่สุด จองด่วนก่อนบัตรจะหมด!",
    eventDate: new Date(Date.now() + 86400000 * 7).toISOString(),
    minPrice: 550000,
    imageUrl: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80&w=2000",
    venue: { name: "The Grand Theater", city: "Chiang Mai" },
    genres: ["Acoustic", "Rock", "Ballad"],
    artists: [
      { name: "Acoustic Legends", image: "https://ui-avatars.com/api/?name=Acoustic+Legends&background=5C2D11&color=fff&size=150" }
    ],
    organizer: { name: "Live Session TH", image: "https://picsum.photos/seed/livesession/200/200" },
    sessions: [
      { id: "s1", displayDate: "Sun, June 11", displayTime: "20:00 - 22:30" }
    ]
  },
  {
    id: "evt_4",
    name: "Electric Dreams",
    artist: "DJ Aurora",
    description: "A mesmerizing EDM experience with state-of-the-art laser shows and world-class sound systems.",
    fullDescription: "ปลดปล่อยพลังงานของคุณใน 'Electric Dreams' ⚡👾\n\nปาร์ตี้ EDM ที่จะหยุดทุกลมหายใจ! พบกับ DJ Aurora ที่จะพกบีทสุดเดือดมาเขย่าฟลอร์แดนซ์ พร้อมกับเลเซอร์โชว์ระดับโลกที่จัดเต็มทุกมิติ เต้นกันให้ยับแบบ Non-stop ตลอดคืน ณ Club Zenith สถานบันเทิงระดับท็อปของภูเก็ต\n\nความมันส์ที่คุณจะพบเจอ:\n🎶 ระบบเสียง Line Array ระดับโลกที่กระแทกใจทุกบีท\n🎶 Laser & Light Show ที่ออกแบบโดยทีมงานระดับอินเตอร์\n🎶 แขกรับเชิญพิเศษ MC Thunder ที่จะมา Hype ให้คุณกระโดดไม่หยุด\n🎶 โซน VIP พร้อมเครื่องดื่มไม่อั้นและพื้นที่ส่วนตัว\n\nอย่าลืมเตรียมร่างกายให้พร้อม แล้วมาสนุกสุดเหวี่ยงไปด้วยกันจนสว่าง!",
    eventDate: new Date(Date.now() + 86400000 * 45).toISOString(),
    minPrice: 150000,
    imageUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=2000",
    venue: { name: "Club Zenith", city: "Phuket" },
    genres: ["EDM", "House", "Trance"],
    artists: [
      { name: "DJ Aurora", image: "https://ui-avatars.com/api/?name=DJ+Aurora&background=DC2626&color=fff&size=150" },
      { name: "MC Thunder", image: "https://picsum.photos/seed/mcthunder/200/200" }
    ],
    organizer: { name: "Zenith Entertainment", image: "https://ui-avatars.com/api/?name=Zenith&background=000&color=fff&size=150" },
    sessions: [
      { id: "s1", displayDate: "Fri, August 18", displayTime: "22:00 - 03:00" }
    ]
  }
];

let dummyOrders = [
  {
    id: "ORD-982374",
    eventName: "Cyberpunk Symphony 2077",
    status: "confirmed",
    currency: "THB",
    eventDate: new Date(Date.now() + 86400000 * 14).toISOString(),
    venue: "Neon Arena",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    items: [
      { id: "TKT-001", seatNumber: "A12", price: 3500 },
      { id: "TKT-002", seatNumber: "A13", price: 3500 }
    ]
  },
  {
    id: "ORD-554112",
    eventName: "Electric Dreams",
    status: "pending",
    currency: "THB",
    eventDate: new Date(Date.now() + 86400000 * 45).toISOString(),
    venue: "Club Zenith",
    createdAt: new Date().toISOString(),
    items: [
      { id: "TKT-003", seatNumber: "VIP-1", price: 5000 }
    ]
  }
];

// ─── MOCK ENDPOINTS ──────────────────────────────────────────────────────────

// 1. Auth endpoints
mock.onPost('/auth/login').reply(config => {
  const { email, password } = JSON.parse(config.data);
  if (email && password) {
    return [200, { success: true, token: "mock_jwt_token_123456789", user: { id: "u_1", email, name: "VIP User" } }];
  }
  return [401, { message: "Invalid credentials" }];
});

mock.onPost('/auth/register').reply(200, { success: true, message: "User registered successfully" });

// 2. Event endpoints
mock.onGet('/events').reply(200, dummyEvents);

mock.onGet(/\/events\/evt_\d+/).reply(config => {
  const id = config.url.split('/').pop();
  const event = dummyEvents.find(e => e.id === id);
  return event ? [200, event] : [404, { message: "Event not found" }];
});

// 3. Seat Inventory endpoints
// This mocks the availability of seats. We'll just say some are taken.
mock.onGet(/\/inventory\/concerts\/evt_\d+\/seats\/available/).reply(200, [
  { seatNumber: "A1" }, { seatNumber: "A2" }, { seatNumber: "A5" }, { seatNumber: "A6" },
  { seatNumber: "B3" }, { seatNumber: "B4" }, { seatNumber: "B5" }, { seatNumber: "B6" },
  { seatNumber: "C1" }, { seatNumber: "C2" }, { seatNumber: "C3" }, { seatNumber: "C4" },
  { seatNumber: "D7" }, { seatNumber: "D8" }, { seatNumber: "E1" }, { seatNumber: "E2" }
]);

mock.onPost('/inventory/seats').reply(200, { success: true }); // Fake seeding

// 4. Order endpoints
mock.onPost('/orders').reply(config => {
  const payload = JSON.parse(config.data);
  const newOrder = {
    id: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
    eventName: payload.items?.[0]?.concertName || "New Event",
    status: "confirmed",
    currency: "THB",
    eventDate: new Date(Date.now() + 86400000 * 5).toISOString(),
    venue: "Main Stadium",
    createdAt: new Date().toISOString(),
    items: payload.items?.map((item, i) => ({
      id: `TKT-NEW-${i}`,
      seatNumber: item.seatNumber,
      price: item.price
    })) || []
  };
  dummyOrders.unshift(newOrder); // Add to front of history
  return [200, newOrder];
});

mock.onGet(/\/orders\/user\/.+/).reply(200, dummyOrders);

// Validate Promo
mock.onGet(/\/orders\/promo\/validate/).reply(config => {
  const urlParams = new URLSearchParams(config.url.split('?')[1]);
  const code = urlParams.get('code');
  if (code && code.toUpperCase() === 'STAGE20') {
    return [200, { code: 'STAGE20', discountPercentage: 20 }];
  }
  return [400, { error: "Invalid promo code (Hint: try STAGE20)" }];
});

console.log("Mock API initialized: Intercepting all requests.");
export default mock;
