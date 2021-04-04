import React from "react";
import { Grid, Typography } from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const SliderView = (props) => {
  return (
    <Grid item xs={12} style={{ marginTop: 2 }}>
      <Carousel
        showThumbs={false}
        showStatus={false}
        autoPlay
        infiniteLoop
        interval={2000}
        style={{ height: "40px" }}
      >
        {props?.data?.items?.nodes?.map((item, index) => (
          <div key={index}>
            <img src={item?.imageUrl} height="180" alt="" />
          </div>
        ))}
      </Carousel>
    </Grid>
  );
};

const BannerView = (props) => {
  /* Banner Images */
  return (
    <>
      {props?.data?.items?.nodes?.map((item, index) => (
        <Grid item xs={12} style={{ height: 200, padding: 5 }} key={index}>
          <img src={item?.imageUrl} height="100%" width="100%" alt="" />
        </Grid>
      ))}
    </>
  );
};

const ImageGridView = (props) => {
  /* Image Grid */
  return (
    <Grid item xs={12} container>
      {props?.data?.items?.nodes?.map((item, index) => (
        <Grid
          item
          xs={6}
          style={{ position: "relative", padding: 5 }}
          key={index}
        >
          <img
            src={item?.imageUrl}
            height="100%"
            width="100%"
            alt=""
            style={{ opacity: 0.5 }}
          />
          <Typography
            style={{
              color: "#fff",
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            {item?.name}
          </Typography>
        </Grid>
      ))}
    </Grid>
  );
};

const ProductView = (props) => {
  /* Product Grid */
  return (
    <>
      <Typography style={{ margin: "0 auto" }}>
        {props?.data?.displayName}
      </Typography>
      <Grid item xs={12} container style={{ padding: 5 }}>
        {props?.data?.items?.nodes?.map((item, index) => (
          <Grid
            item
            xs={6}
            style={{
              border: "1px solid #000",
            }}
            key={index}
          >
            <img src={item.imageUrl} height="100%" width="100%" alt="" />
          </Grid>
        ))}
      </Grid>
    </>
  );
};

const InstagramView = (props) => {
  /* Instagram Grid */
  return (
    <>
      <Typography style={{ margin: "0 auto" }}>
        {props?.data?.displayName}
      </Typography>
      <Grid
        item
        xs={12}
        container
        style={{ padding: 5 }}
        spacing={1}
        direction="row"
        justify="center"
        alignItems="center"
      >
        {props?.data?.items?.nodes?.map((item, index) => (
          <Grid item xs={4} key={index}>
            <img src={item?.imageUrl} height="100%" width="100%" alt="" />
          </Grid>
        ))}
      </Grid>
    </>
  );
};

const Preview = (props) => {
  return (
    <Grid container style={{ flexGrow: 1 }}>
      {/*  Header  */}
      <Grid
        item
        xs={12}
        container
        direction="row"
        justify="space-between"
        alignItems="center"
        style={{
          height: 40,
          width: 365,
          backgroundColor: "#000",
          position: "relative",
        }}
      >
        <Grid item xs={3}>
          <MenuIcon
            style={{ color: "#fff", position: "absolute", left: 0, top: 2 }}
          />
        </Grid>
        <Grid item xs={3}>
          <Typography
            style={{
              color: "#fff",
              position: "absolute",
              left: "45%",
              top: 2,
            }}
          >
            Vajro
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <ShoppingCartIcon
            style={{ color: "#fff", position: "absolute", right: 0, top: 2 }}
          />
        </Grid>
      </Grid>

      {props?.data &&
        props?.data?.allWidgets?.nodes.map((item, index) => (
          <React.Fragment key={index}>
            {item?.type?.name === "Slider" && <SliderView data={item} />}
            {item?.type?.name === "Image" && <ImageGridView data={item} />}
            {item?.type?.name === "Banner" && <BannerView data={item} />}
            {item?.type?.name === "Instagram" && <InstagramView data={item} />}
            {item?.type?.name === "Product" && <ProductView data={item} />}
          </React.Fragment>
        ))}
    </Grid>
  );
};

export default Preview;
