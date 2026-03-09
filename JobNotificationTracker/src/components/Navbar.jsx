import { NavLink, Link } from 'react-router-dom';

const Navbar = ({ savedCount }) => {
    return (
        <nav>
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', maxWidth: '1200px' }}>
                <Link to="/" style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', fontWeight: '900', color: 'var(--accent-color)', letterSpacing: '-0.02em' }}>
                    JNT.
                </Link>
                <ul className="nav-links">
                    <li>
                        <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                            Dashboard
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/saved" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                            Saved {savedCount > 0 && <span style={{ marginLeft: '4px', fontSize: '0.8rem', opacity: 0.7 }}>({savedCount})</span>}
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/digest" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                            Digest
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/settings" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                            Settings
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/jt/proof" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                            Proof
                        </NavLink>
                    </li>
                </ul>
                <div style={{ width: '60px' }}></div>
            </div>
        </nav>
    );
};

export default Navbar;
