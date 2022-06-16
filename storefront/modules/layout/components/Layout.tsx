import Header from './Header';

const Layout = ({ children }) => {
  return (
    <>
      <Header />
      <main className="container mx-auto">{children}</main>
    </>
  );
};

export default Layout;
