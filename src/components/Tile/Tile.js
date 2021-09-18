import './Tile.css'

export default function Tile(props) {
    if (props.piece !== "none") {
        return (
            <div className={"tile " + props.type}>
                <div className="piece" style={{backgroundImage: "url(assets/pieces/" + props.colour + "_" + props.piece + ".svg)"}}></div>
            </div>
        );
    } else {
        return (
            <div className={"tile " + props.type}></div>
        )
    }
    
}
