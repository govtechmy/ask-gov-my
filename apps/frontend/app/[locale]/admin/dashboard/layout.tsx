const Layout = ({ children, params, header }) => {
  return (
    <>
      {header}
      <div className="container max-w-screen-lg mx-auto p-4.5 pt-0 lg:px-0">
        {children}
      </div>
    </>
  );
};

export default Layout;
