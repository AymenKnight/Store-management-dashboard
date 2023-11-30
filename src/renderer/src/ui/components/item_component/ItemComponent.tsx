import './style/index.scss';
import default_product from 'toPng/default_product.jpg';
interface ItemComponentProps {
  width?: number;
  height?: number;
  src?: string;
  title: string;
  category: string;
  price: string;
}
export default function ItemComponent({
  width = 100,
  height = 100,
  src = default_product,
  title,
  category,
  price,
}: ItemComponentProps) {
  return (
    <div className="item-component">
      <img src={default_product} />
      <div>
        <div className="title_and_category">
          <div>{title}</div>
          <div>{category}</div>
        </div>
        <div className="price">{price}</div>
      </div>
    </div>
  );
}
