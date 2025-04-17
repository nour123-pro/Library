import { Link } from "react-router-dom";


export default function again(){
    return(
        <div className="Content">
        <div className="LeftSide">
            <aside className="sidebar">
                <header className="sidebar-header">
                    <a href="#" className="header-logo">
                    <div  style={{ width: 30, height: "auto",fontSize:20,display:"flex",flexDirection:"row",alignItems:"center",justifyContent:"center",backgroundColor:"white",borderRadius:"50%",color:"brown", }}>
n
</div>
                    </a>
                    <button className="toggler sidebar-toggler">
                        <span className="material-symbols-rounded">chevron_left</span>
                    </button>
                    <button className="toggler menu-toggler">
                        <span className="material-symbols-rounded">menu</span>
                    </button>
                </header>
                <nav className="sidebar-nav">
                    <ul className="nav-list primary-nav">
                        <li className="nav-item">
                            <a href="#" className="nav-link">
                                <Link to="/">
                                <span className="nav-icon material-symbols-rounded">dashboard</span>
                                </Link>
                                <span className="nav-label">Dashboard</span>
                            </a>
                            <span className="nav-tooltip">Dashboard</span>
                        </li>
                        <li className="nav-item">
                            <a href="chat.html" className="nav-link">
                                <span className="nav-icon material-symbols-rounded">notifications</span>
                                <span className="nav-label">ChatRoom</span>
                            </a>
                            <span className="nav-tooltip">Notifications</span>
                        </li>
                        <li className="nav-item">
                            <a href="#" className="nav-link">
                                <span className="nav-icon material-symbols-rounded">star</span>
                                <span className="nav-label">Save To Read</span>
                            </a>
                            <span className="nav-tooltip">Bookmarks</span>
                        </li>
                        <li className="nav-item">
                            <a href="#" className="nav-link">
                                <span className="nav-icon material-symbols-rounded">settings</span>
                                <span className="nav-label" >Settings</span>
                            </a>
                        </li>
                    </ul>
                    <ul className="nav-list">
                        <li className="nav-item">
                            <a href="#" className="nav-link">
                                <span className="nav-icon material-symbols-rounded">account_circle</span>
                                <span className="nav-label">Profile</span>
                            </a>
                        </li>
                        <li className="nav-item">
                            <a href="#" className="nav-link">
                                <span className="nav-icon material-symbols-rounded">logout</span>
                                <Link to={"/"}>
                                <span className="nav-label"  >Logout</span>
                                </Link>
                                
                            </a>
                            <span className="nav-tooltip">Logout</span>
                        </li>
                    </ul>
                </nav>
            </aside>
        </div>
        


        
        
        </div>

    );
}