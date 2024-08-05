import Nav from "./Navbar";

export default function Header () {

    return (
        <div className="header">
        <h1 className="text-center p-2">Tumorido <span className="text-warning" >Fit</span>Track</h1>
        <Nav />
        </div>
    )
}