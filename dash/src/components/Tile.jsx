const Tile = ({ value, onClick, highlight }) => (
  <button
    className="tile"
    onClick={onClick}
    style={{
      background: highlight ? '#ffbe3b' : undefined,
      transition: 'background 0.3s'
    }}
  >
    {value ? <img src={value} alt="face" /> : null}
  </button>
);

export default Tile;
