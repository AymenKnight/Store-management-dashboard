import './style/index.scss';
import TextButton from '@components/buttons/text_button';
import { BsThreeDotsVertical } from 'react-icons/bs';

import default_product from 'toPng/default_product.png';

import { MdEdit } from 'react-icons/md';

interface ProductCardProps {
  src?: string;
  title: string;
  Available: number;
  sold: number;
  price: number;
  salePrice?: number;
}
export default function ProductCard({
  src = undefined,
  title,
  Available,
  sold,
  price,
  salePrice = undefined,
}: ProductCardProps) {
  return (
    <div className="product-card">
      <div className="product-card-top">
        <img src={src ? src : default_product} />
        <TextButton
          Icon={<BsThreeDotsVertical size={25} color="rgb(79,137,252)" />}
          className="TextButton"
        />
      </div>
      <span>{title}</span>
      <div className="product-card-middle">
        <span css={{ color: 'rgb(1,186,157)' }}>Available : {Available}</span>
        <span css={{ color: 'rgb(57,135,252)' }}>sold : {sold}</span>
        <span css={{ color: 'white' }}>price : {price} DZ</span>
        <span css={{ color: 'white' }}>
          sale price : {salePrice === undefined ? 0 : 'no sale'} DZ
        </span>
      </div>
      <div className="product-card-bottom">
        <div className="edit">
          <MdEdit />
          <a href="www.google.com">Edit</a>
        </div>
        <button onClick={() => {}} className="delete">
          Delete
        </button>
      </div>
    </div>
  );
}
