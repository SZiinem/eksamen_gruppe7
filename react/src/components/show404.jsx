export default function Show404() {
    return (
        <>
            {/* <img src="/404.png" alt="404 Not Found" style={{ maxWidth: '100%', margin: '20px 0' }} /> gammel kode med inline CSS */}
            <img className="show-error-image" src="/404.png" alt="404 Not Found" />
            <p>Sorry, the page you are looking for does not exist or are currently being built. The builders are a shopping bag and a dog, so this might take some time...</p>
        </>
    )
}


// Endret forbokstav på fila show404.jsx til stor - Show404.jsx