import styles from "./Name.module.css"

interface NameProps {
    name: string;
    id: string;
    like: number;
}

const Name = (props: NameProps) => {
    const {name = "未知", id = "未知", like = 0} = props;
    return (
        <div className={styles.name}>
            <div className={styles.nameId}>
                <strong>{name}</strong>
                <div>ID: {id}</div>
            </div>
            <div className={styles.like}>{like}</div>
        </div>
    )
}

export default Name;