export default function Item({ item: { id, quantity, description, packed }, onDeleteItem, onToggleItems }) {
    return (
        <li>
            <input
                type="checkbox"
                checked={packed}
                onChange={() => onToggleItems(id)} />
            <span style={packed ? { textDecoration: "line-through" } : {}}>
                {quantity} {description}
            </span>
            <button onClick={() => onDeleteItem(id)}>❌</button>
        </li>
    );
}
