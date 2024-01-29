import Propiedad from './Propiedad.js';
import Precio from './Precio.js';
import Categoria from './Categoria.js';
import Usuario from './Usuario.js';

// Precio.hasOne(Propiedad)  // de esta manera es como si leyera de derecha a izquierda
Propiedad.belongsTo(Precio, {foreignKey:'precioId'});
Propiedad.belongsTo(Categoria, {foreignKey:'categoriaId'});
Propiedad.belongsTo(Usuario, {foreignKey : 'usuarioId'});

export {
    Propiedad,
    Precio,
    Categoria,
    Usuario
}
