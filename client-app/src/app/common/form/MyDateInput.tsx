import { useField } from "formik";
import { Form, Label} from "semantic-ui-react";
import DatePicker from "react-datepicker";

interface Props{
    placeholder:string;
    name: string;
    label?:string;
    showTimeSelect?: boolean;
    timeCaption?: string;
    dateFormat?: string;

}
export default function MyDateInput(props:Props){
    const[field,meta,helpers]=useField(props.name!);
    return(
        //The !! in front of the error object casts it into a boolean
        <Form.Field error={meta.touched&& !!meta.error}>
            <DatePicker
                {...field}
                {...props}
                selected={(field.value && new Date(field.value))||null}
                onChange={value=>helpers.setValue(value)}
            />
            
            {meta.touched && meta.error?(
                <Label basic color='red'>{meta.error}</Label>
            ):null}
        </Form.Field>
    )

}