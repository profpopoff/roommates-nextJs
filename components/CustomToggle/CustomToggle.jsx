import styles from './CustomToggle.module.scss'

export default function CustomToggle(props) {

    // const [isTrue, setIsTrue] = React.useState(props.checked)
 
    // React.useEffect(() => {
    //    setIsTrue(props.checked)
    // }, [props.checked])
 
    return (
        <div className={styles.container}>
            <label className={styles.label} htmlFor={props.name}>{props.label}</label>
            <input
                className={styles.toggle}
                type="checkbox"
                id={props.name}
                // defaultChecked={isTrue}
                defaultChecked={props.checked}
                value={props.name}
                onChange={props.onChange}
                onClick={props.onClick}
                disabled={props.disabled}
            />
        </div>
    )
 }