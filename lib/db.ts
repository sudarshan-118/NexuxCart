import { Product, User, Order, Review, Notification, Category } from './types';

declare global {
  var _mockDb: {
    products: Product[];
    users: User[];
    orders: Order[];
    reviews: Review[];
    notifications: Notification[];
  } | undefined;
}

const _baseItems = [
  // Electronics
  { name: 'Apple MacBook Pro 14 Inch', price: 124999.00, cat: 'Electronics', img: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80' },
  { name: 'Asus Zenbook Pro', price: 104999.00, cat: 'Electronics', img: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=800&q=80' },
  { name: 'Apple Airpods Plus', price: 18999.00, cat: 'Electronics', img: 'https://images.unsplash.com/photo-1605464315542-bda3e2f4e605?auto=format&fit=crop&w=800&q=80' },
  { name: 'Amazon Echo Smart Speaker', price: 8999.00, cat: 'Electronics', img: 'https://images.unsplash.com/photo-1543512214-318c7553f230?auto=format&fit=crop&w=800&q=80' },
  { name: 'Rolex Luxury Watch', price: 89999.00, cat: 'Electronics', img: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=800&q=80' },
  { name: 'Longines Master Watch', price: 45999.00, cat: 'Electronics', img: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80' },
  // Clothing
  { name: 'Nike Air Jordan 1', price: 14999.00, cat: 'Clothing', img: 'https://images.unsplash.com/photo-1575537302964-96cd47c06b1b?auto=format&fit=crop&w=800&q=80' },
  { name: 'Puma Future Trainers', price: 8999.00, cat: 'Clothing', img: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=800&q=80' },
  { name: 'Blue & Black Check Shirt', price: 2999.00, cat: 'Clothing', img: 'https://images.unsplash.com/photo-1596755094514-f87e32f85ce9?auto=format&fit=crop&w=800&q=80' },
  { name: 'Gigabyte Aorus T-Shirt', price: 1999.00, cat: 'Clothing', img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80' },
  { name: 'Man Plaid Shirt', price: 3499.00, cat: 'Clothing', img: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=80' },
  { name: 'Off White Sneakers', price: 11999.00, cat: 'Clothing', img: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=800&q=80' },
  // Home & Garden
  { name: 'Annibale Colombo Bed', price: 89999.00, cat: 'Home & Garden', img: 'https://images.unsplash.com/photo-1505693314120-0d443867891c?auto=format&fit=crop&w=800&q=80' },
  { name: 'Annibale Colombo Sofa', price: 124999.00, cat: 'Home & Garden', img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80' },
  { name: 'Knoll Executive Chair', price: 35999.00, cat: 'Home & Garden', img: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=800&q=80' },
  { name: 'Decoration Swing', price: 5999.00, cat: 'Home & Garden', img: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=800&q=80' },
  { name: 'House Showpiece Plant', price: 3999.00, cat: 'Home & Garden', img: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=800&q=80' },
  { name: 'Modern Table Lamp', price: 4999.00, cat: 'Home & Garden', img: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80' },
  // Sports
  { name: 'American Pro Football', price: 2999.00, cat: 'Sports', img: 'https://images.unsplash.com/photo-1610815127599-44cff68faab1?auto=format&fit=crop&w=800&q=80' },
  { name: 'Pro Baseball Glove', price: 4999.00, cat: 'Sports', img: 'https://images.unsplash.com/photo-1508344928928-7165b67de128?auto=format&fit=crop&w=800&q=80' },
  { name: 'Official Basketball', price: 3499.00, cat: 'Sports', img: 'https://images.unsplash.com/photo-1519861531473-920026bf1ea8?auto=format&fit=crop&w=800&q=80' },
  { name: 'Golf Master Club', price: 2499.00, cat: 'Sports', img: 'https://images.unsplash.com/photo-1535139262971-c51845709a48?auto=format&fit=crop&w=800&q=80' },
  { name: 'Pro Tennis Racket', price: 8999.00, cat: 'Sports', img: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&w=800&q=80' },
  { name: 'Championship Volleyball', price: 2999.00, cat: 'Sports', img: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?auto=format&fit=crop&w=800&q=80' },
  // Books (Using reliable Unsplash placeholders for books)
  { name: 'Programming Handbook', price: 1299.00, cat: 'Books', img: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=800&q=80' },
  { name: 'Fantasy Novel Anthology', price: 1499.00, cat: 'Books', img: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=800&q=80' },
  { name: 'Chef Daily Cookbook', price: 1899.00, cat: 'Books', img: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80' },
  { name: 'Business Strategy Guide', price: 999.00, cat: 'Books', img: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=800&q=80' },
  { name: 'Modern Architecture', price: 2499.00, cat: 'Books', img: 'https://images.unsplash.com/photo-1495640388908-05fa85288e61?auto=format&fit=crop&w=800&q=80' },
  { name: 'Mindfulness Journal', price: 799.00, cat: 'Books', img: 'https://images.unsplash.com/photo-1524578974012-70b09424c1bc?auto=format&fit=crop&w=800&q=80' },
];

const generateProducts = (): Product[] => {
  const generated: Product[] = [];
  let id = 1;
  const variants = [
    { prefix: '', suffix: '', multiplier: 1.0, stockScale: 1 },
    { prefix: 'Premium ', suffix: '', multiplier: 1.8, stockScale: 0.5 },
    { prefix: 'Lite ', suffix: '', multiplier: 0.6, stockScale: 2 },
    { prefix: 'Pro ', suffix: ' Gen-2', multiplier: 1.4, stockScale: 0.8 },
    { prefix: '', suffix: ' - Essential Edition', multiplier: 0.8, stockScale: 1.5 },
  ];

  for (let v = 0; v < variants.length; v++) {
    const variant = variants[v];
    for (let b = 0; b < _baseItems.length; b++) {
      const base = _baseItems[b];
      // Use index-based deterministic fake random stock
      const pseudoRandom = ((v + 1) * (b + 1) % 40) + 5; 
      
      let imageUrl = base.img;
      // Provide a Lorem Picsum fallback variation so variants have slightly different images or fallback URLs if needed
      if (variant.prefix !== '' || variant.suffix !== '') {
         // Create a visually cohesive but distinct image by relying on deterministic seed
         const seedStr = variant.prefix.trim() + base.name.replace(/\s+/g,'');
         imageUrl = `https://picsum.photos/seed/${seedStr}/800/800`;
      }

      generated.push({
        id: String(id++),
        name: `${variant.prefix}${base.name}${variant.suffix}`,
        description: `High-quality ${variant.prefix.toLowerCase()}${base.name.toLowerCase()}${variant.suffix.toLowerCase()} designed for modern living and everyday utility.`,
        price: Math.floor(base.price * variant.multiplier),
        category: base.cat as Category,
        stock: Math.max(1, Math.floor(pseudoRandom * variant.stockScale)),
        imageUrl: imageUrl, // High fidelity perfect match images OR seeded variations
        createdAt: new Date('2026-04-19T00:00:00Z').toISOString()
      });
    }
  }
  return generated;
};

if (!global._mockDb) {
  global._mockDb = {
    products: generateProducts(),
    users: [
      { id: 'u1', name: 'Admin User', email: 'admin@store.com', role: 'admin' },
      { id: 'u2', name: 'Jane Doe', email: 'jane@store.com', role: 'customer' },
    ],
    orders: [],
    reviews: [
      { id: 'r1', productId: '1', userId: 'u2', userName: 'Jane Doe', rating: 5, text: 'Amazing build quality and performance!', createdAt: new Date().toISOString() },
      { id: 'r2', productId: '1', userId: 'u3', userName: 'John Smith', rating: 4, text: 'Good, but a bit pricey.', createdAt: new Date().toISOString() },
      { id: 'r3', productId: '22', userId: 'u2', userName: 'Jane Doe', rating: 5, text: 'Very useful for my daily workouts.', createdAt: new Date().toISOString() },
    ],
    notifications: [],
  };
}

export const mockDb = global._mockDb;
