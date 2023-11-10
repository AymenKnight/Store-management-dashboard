import BlueAddButton from '@components/buttons/blue_add_button';
import './style/index.scss';
import Field from '@components/inputs/field';
import { SubmitHandler, useForm } from 'react-hook-form';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import color from '@assets/styles/color';

interface Inputs {
  search: string;
}
interface TableHeaderControlsProps {
  text: string;
  onAdd?: () => void;
}
export default function TableHeaderControls({
  text,
  onAdd,
}: TableHeaderControlsProps) {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: {
      search: '',
    },
  });
  const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data);
  return (
    <div className="table-header-controls">
      <BlueAddButton text={text} onPress={onAdd} />
      <Field
        type="text"
        controllerProps={{ name: 'search', control: control }}
        inputProps={{
          placeholder: 'Search',
        }}
        Leading={
          <MagnifyingGlassIcon width={25} height={25} fill={color.secondary} />
        }
      />
    </div>
  );
}
