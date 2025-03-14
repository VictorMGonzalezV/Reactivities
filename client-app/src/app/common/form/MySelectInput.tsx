import { useField } from "formik";
import { Form, Label, Select} from "semantic-ui-react";

interface Props{
    placeholder:string;
    name: string;
    options:any;
    label?:string;

}
export default function MyTextInput(props:Props){
    const[field,meta,helpers]=useField(props.name);
    return(
        //The !! in front of the error object casts it into a boolean
        <Form.Field error={meta.touched&& !!meta.error}>
            <label>{props.label}</label>
            <Select
                clearable
                options={props.options}
                value={field.value||null}
                onChange={(_,d)=>helpers.setValue(d.value)}
                onBlur={()=>helpers.setTouched(true)}
                plceholder={props.placeholder}           
            />
            {meta.touched && meta.error?(
                <Label basic color='red'>{meta.error}</Label>
            ):null}
        </Form.Field>
    )

}