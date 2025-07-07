const Tile = ({ value, onClick }) => (
  <button className="tile" onClick={onClick}>
    {value ? <img src={value} alt="face" /> : null}
  </button>
);

export default Tile;
