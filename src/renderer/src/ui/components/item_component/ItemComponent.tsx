import './style/index.scss';
import default_product from 'toPng/default_product.jpg';
interface ItemComponentProps {
  src?: string;
  title: string;
  category: string;
  price: string;
  style?: React.CSSProperties;
}
export default function ItemComponent({
  src = default_product,
  title,
  category,
  price,
  style,
}: ItemComponentProps) {
  return (
    <div className="item-component" style={style}>
      <img src={src} />
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
