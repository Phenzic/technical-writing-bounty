const styles = {
    root: {
      display: 'grid',
      placeItems: 'center',
      height: '100vh',
      width: '100vw',
      backgroundColor: "black",
    } as React.CSSProperties,
    container: {
      color: "#ffffffec",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    } as React.CSSProperties,
    tabContainer: {
      display: "flex",
      justifyContent: "center",
      marginBottom: "20px",
    } as React.CSSProperties,
    tab: {
      marginRight: "10px",
      cursor: "pointer",
      fontSize: "20px",
      color: "#a0a0a0", // Adjusted color for better visibility
      borderBottom: "2px solid transparent",
      paddingBottom: "5px",
    } as React.CSSProperties,
    activeTab: {
      borderBottom: "2px solid #ffffffec", // Highlighting the active tab
      color: "#ffffffec", // Adjusted color for better visibility
    } as React.CSSProperties,
    label: {
      fontSize: "18px",
      marginTop: "10px",
    } as React.CSSProperties,
    button: {
      borderRadius: "8px",
      marginTop: "24px",
      backgroundColor: "#707070",
      fontSize: "16px",
      color: "#ffffffec",
      border: "none",
      outline: "none",
      height: "40px",
      padding: "0 1rem",
      cursor: "pointer",
    } as React.CSSProperties,
    userInfo: {
      marginTop: "10px",
      padding: "8px",
      borderRadius: "8px",
      backgroundColor: "#333",
      color: "#ffffff",
    } as React.CSSProperties,
  };
  
export default styles;
  