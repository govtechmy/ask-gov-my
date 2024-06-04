const SearchNavbar: React.FC = () => {
    return (
        <nav style={{ backgroundColor: '#000', padding: '10px 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
                <h1 style={{ margin: 0, color: '#fff' }}>ask.gov</h1>
                <form style={{ display: 'flex', alignItems: 'center' }}>
                    <input type="text" placeholder="Search..." style={{ padding: '8px', border: 'none', borderRadius: '4px', marginRight: '10px' }} />
                    <button type="submit" style={{ padding: '8px 20px', border: 'none', borderRadius: '4px', backgroundColor: '#007bff', color: '#fff', cursor: 'pointer', transition: 'background-color 0.3s' }}>
                        Search
                    </button>
                </form>
            </div>
        </nav>
    );
}

export default SearchNavbar;
