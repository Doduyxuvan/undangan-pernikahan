export interface WeddingInfo {
    id: string
    groom_name: string
    bride_name: string
    groom_full_name: string
    bride_full_name: string
    groom_parents: string
    bride_parents: string
    akad_date: string
    akad_time: string
    akad_venue: string
    akad_address: string
    reception_date: string
    reception_time: string
    reception_venue: string
    reception_address: string
    maps_url: string
    maps_embed: string
    live_streaming_url: string
    backsound_url: string
    backsound_title: string
    bank_accounts: BankAccount[]
    hero_image_url: string
    story: string
    updated_at: string
  }
  
  export interface BankAccount {
    bank: string
    account_number: string
    account_name: string
  }
  
  export interface GalleryPhoto {
    id: string
    url: string
    caption: string
    type: 'image' | 'video' | 'youtube'
    youtube_id?: string
    order: number
    created_at: string
  }
  
  export interface TimelineItem {
    id: string
    title: string
    description: string
    date: string
    photo_url: string
    order: number
  }
  
  export interface RSVPEntry {
    id: string
    guest_name: string
    attendance: 'hadir' | 'tidak_hadir' | 'mungkin'
    guests_count: number
    message: string
    created_at: string
  }
  
  export interface WishEntry {
    id: string
    name: string
    message: string
    created_at: string
  }
  
  export interface Guest {
    id: string
    name: string
    slug: string
    phone: string
    notes: string
    rsvp_status: string
    created_at: string
  }