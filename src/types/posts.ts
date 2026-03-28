export type RunningPost = {
  id?: number;
  url: string;
  title: string;
  commentCountToday?: number;
  commentTotalCount?: number;
  lastCommentAt?: Date | null;
  selected?: boolean;
};

export type ApiPost = {
  id: number;
  name: string;
  link: string; 
  fb_post_id: string;
  updated_at: string;
  count_today: number;
  total_count: number;

};

export type CommentStatus = 'normal' | 'fail' | 'success' | 'isCalling';

export type Comment = {
  id: string;
  uid: string;
  fb_name: string;
  avatar_user: string | null;
  content: string;
  phone: string | null;
  timestamp: string;
  status: CommentStatus;
  id_post: string;
  post: {
    id: number;
    name: string;
    link: string;
  };
};

export type CommentsResponse = {
  success: boolean;
  data: Comment[];
};

export type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled';

export type Order = {
  id: number;
  product_name: string;
  customer_name: string;
  avatar_customer?: string;
  phone: string;
  address: string;
  note: string;
  price: number;        // đơn giá (price per unit)
  total_price: number;  // tổng tiền = price * quality
  status?: OrderStatus;
  quality: number;      // số lượng (sản phẩm)
  createdAt: string;
};

export type OrdersResponse = {
  success: boolean;
  data: Order[];
};

// Types cho API địa chỉ Việt Nam (provinces.open-api.vn)
export type Province = {
  name: string;
  code: number;
  division_type: string;
  codename: string;
  phone_code: number;
  districts: District[];
};

export type District = {
  name: string;
  code: number;
  division_type: string;
  codename: string;
  province_code: number;
  wards: Ward[];
};

export type Ward = {
  name: string;
  code: number;
  division_type: string;
  codename: string;
  district_code: number;
};

export type AddressDetail = {
  province: Province | null;
  district: District | null;
  ward: Ward | null;
  street: string;
  fullAddress: string;
};