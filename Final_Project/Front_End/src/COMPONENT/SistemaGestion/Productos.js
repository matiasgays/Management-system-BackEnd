import * as React from "react";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarExport,
  GridToolbarDensitySelector,
} from "@mui/x-data-grid";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CreateIcon from "@mui/icons-material/Create";
import { Button, TextField, Typography } from "@mui/material";
import { Grid } from "@mui/material";
import { Modal, Box } from "@mui/material";
import { useState, useEffect } from "react";
import { Producto } from "./Models/Models.tsx";
import { useSelector, useDispatch } from "react-redux";
import {
  getProductos,
  postProducto,
  putProducto,
  deleteProducto,
} from "../redux/actions/ProductoAction";

const columns = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "description", headerName: "Description", width: 250 },
  { field: "cost", headerName: "Cost", width: 130, type: "number" },
  {
    field: "salePrice",
    headerName: "sale Price",
    type: "number",
    width: 130,
  },
  {
    field: "stock",
    headerName: "Stock",
    type: "number",
    width: 130,
  },
];

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  border: "2px #000",
  boxShadow: 13,
  borderRadius: 5,
  pt: 2,
  px: 3,
  pb: 10,
};

function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
      <GridToolbarDensitySelector />
      <GridToolbarExport />
    </GridToolbarContainer>
  );
}

export default function Productos(props) {
  const dispatch = useDispatch();
  const productos = useSelector((state) => state.productoReducer?.productos);
  const [rowClicked, setRowClicked] = useState(new Producto());
  const [openCrear, setOpenCrear] = useState(false);
  const [openModificar, setOpenModificar] = useState(false);
  const [openEliminar, setOpenEliminar] = useState(false);
  const [rows, setRows] = useState([new Producto(0, "", 0, 0, 0)]);
  const [productoCrear, setProductoCrear] = useState(
    new Producto(0, "", 0, 0, 0, props.userId)
  );

  useEffect(() => {
    dispatch(getProductos(props.userId));
  }, []);
  
  useEffect(() => {
    setRows(productos);
  }, [productos]);

  const onChangeHandlerAlta = (event) => {
    const { name, value } = event.target;
    setProductoCrear({ ...productoCrear, [name]: value });
  };

  const onClickCrear = () => {
    dispatch(postProducto(productoCrear));
    setProductoCrear(new Producto(0, "", 0, 0, 0, props.userId));
    alert("PRODUCTO CREADO");
    dispatch(getProductos(props.userId));
  };

  const onClickModificar = () => {
    dispatch(putProducto(rowClicked));
    setRowClicked(new Producto(0, "", 0, 0, 0, props.userId));
    alert("PRODUCTO MODIFICADO");
    dispatch(getProductos(props.userId));
  };

  const onClickEliminar = () => {
    dispatch(deleteProducto(rowClicked.id));
    console.log(rowClicked.id);
    setRowClicked(new Producto(0, "", 0, 0, 0, props.userId));
    console.log(props.userId);
    alert("PRODUCTO ELIMINADO");
    dispatch(getProductos(props.userId));
    setOpenEliminar(false)
  };

  useEffect(() => {
  }, [productoCrear]);
  const onRowClick = (e) => {
    setRowClicked(
      new Producto(
        e.row.id,
        e.row.description,
        e.row.cost,
        e.row.salePrice,
        e.row.stock,
        props.userId
      )
    );
  };
  const modalCrearOpen = () => {
    setOpenCrear(true);
  };
  const modalCrearClose = () => {
    setOpenCrear(false);
  };

  const modalModificarOpen = () => {
    setOpenModificar(true);
  };
  const modalModificarClose = () => {
    setOpenModificar(false);
  };
  const modalEliminarOpen = () => {
    setOpenEliminar(true);
  };
  const modalEliminarClose = () => {
    setOpenEliminar(false);
  };

  const onChangeProducto = (e) => {
    const { name, value } = e.target;
    setRowClicked({ ...rowClicked, [name]: value });
  };


  return (
    <>
      <h2>Lista de Productos</h2>
      <div style={{ height: 400, width: "100%" }}>
        <Grid container direction="row" justifyContent="flex-end">
          <Grid margin="10px">
            <Button
              variant="contained"
              startIcon={<AddCircleOutlineIcon />}
              onClick={modalCrearOpen}
            >
              Crear
            </Button>
          </Grid>
          <Grid margin="10px">
            <Button
              variant="contained"
              startIcon={<CreateIcon />}
              disabled={rowClicked.id == undefined}
              onClick={modalModificarOpen}
            >
              Modificar
            </Button>
          </Grid>
          <Grid margin="10px">
            <Button
              variant="contained"
              startIcon={<DeleteForeverIcon />}
              disabled={rowClicked.id == undefined}
              onClick={modalEliminarOpen}
            >
              Eliminar
            </Button>
          </Grid>
        </Grid>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          components={{
            Toolbar: CustomToolbar,
          }}
          onRowClick={onRowClick}
        ></DataGrid>
      </div>

      <Modal
        open={openCrear}
        onClose={modalCrearClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={{ ...style, width: 520 }}>
          <h2 id="parent-modal-title">Crear Producto</h2>
          <h4>Nombre del producto</h4>
          <Grid container direction="row" justifyContent="space-between">
            <Grid item marginBottom={2}>
              <TextField
                id="outlined-basic"
                label="Descripcion"
                variant="outlined"
                name="description"
                InputLabelProps={{ shrink: true }}
                onChange={onChangeHandlerAlta}
                value={productoCrear.description}
              />
            </Grid>
          </Grid>

          <h4>Precios</h4>
          <Grid container direction="row" justifyContent="space-between">
            <Grid item marginBottom={2}>
              <TextField
                type="number"
                id="outlined-basic"
                label="Costo"
                variant="outlined"
                name="cost"
                defaultValue={0}
                InputLabelProps={{ shrink: true }}
                onChange={onChangeHandlerAlta}
                value={productoCrear.cost}
              />
            </Grid>

            <Grid item marginBottom={2}>
              <TextField
                type="number"
                id="outlined-basic"
                label="Precio de Venta"
                variant="outlined"
                name="salePrice"
                defaultValue={0}
                InputLabelProps={{ shrink: true }}
                onChange={onChangeHandlerAlta}
                value={productoCrear.salePrice}
              />
            </Grid>
          </Grid>
          <h4>Stock</h4>
          <Grid item marginBottom={2}>
            <TextField
              type="number"
              id="outlined-basic"
              label="Stock"
              variant="outlined"
              name="stock"
              defaultValue={0}
              InputLabelProps={{ shrink: true }}
              onChange={onChangeHandlerAlta}
              value={productoCrear.stock}
            />
          </Grid>
          <Button variant="contained" onClick={onClickCrear}>
            Crear
          </Button>
        </Box>
      </Modal>

      <Modal
        open={openModificar}
        onClose={modalModificarClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={{ ...style, width: 520 }}>
          <h2 id="parent-modal-title">Modificar Producto</h2>
          <h4>Nombre del producto</h4>
          <Grid container direction="row" justifyContent="space-between">
            <Grid item marginBottom={2}>
              <TextField
                id="outlined-basic"
                name="description"
                label="Descripcion"
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                value={rowClicked.description}
                onChange={onChangeProducto}
              />
            </Grid>
          </Grid>

          <h4>Precios</h4>
          <Grid container direction="row" justifyContent="space-between">
            <Grid item marginBottom={2}>
              <TextField
                type="number"
                id="outlined-basic"
                label="Costo"
                name="cost"
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                value={rowClicked.cost}
                onChange={onChangeProducto}
              />
            </Grid>

            <Grid item marginBottom={2}>
              <TextField
                type="number"
                id="outlined-basic"
                label="Precio de Venta"
                name="salePice"
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                defaultValue={rowClicked.salePrice}
                onChange={onChangeProducto}
              />
            </Grid>
          </Grid>
          <h4>Stock</h4>
          <Grid item marginBottom={2}>
            <TextField
              type="number"
              id="outlined-basic"
              label="Stock"
              name="stock"
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              value={rowClicked.stock}
              onChange={onChangeProducto}
            />
          </Grid>
          <Button variant="contained" onClick={onClickModificar}>Modificar</Button>
        </Box>
      </Modal>
      <Modal
        open={openEliminar}
        onClose={modalEliminarClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={{ ...style, width: 520 }}>
          <h4>¿Seguro que quiere eliminar el siguiente producto?</h4>
          <Grid
            xl={12}
            boxShadow="0px 0px 30px 0px #757575"
            justifyContent="center"
            alignItems="center"
            borderColor="grey"
          >
            <Typography align="center">
              <b>Id:</b> {rowClicked.id}
            </Typography>
            <Typography align="center">
              <b>Descripcion:</b> {rowClicked.description}{" "}
            </Typography>
            <Typography align="center">
              <b>Costo:</b> {rowClicked.cost}{" "}
            </Typography>
            <Typography align="center">
              <b>Precio de Venta:</b> {rowClicked.salePrice}{" "}
            </Typography>
            <Typography align="center">
              <b>Stock:</b> {rowClicked.stock}{" "}
            </Typography>
          </Grid>
          <Grid textAlign={"center"} marginTop="5%">
            <Button variant="contained" onClick={onClickEliminar}>Eliminar</Button>
          </Grid>
        </Box>
      </Modal>
    </>
  );
}
