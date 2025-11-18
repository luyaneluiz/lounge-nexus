import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";

export default function CardItem({ item }) {
    return (
        <Card sx={{ maxWidth: 345 }} border={1} borderColor="secondary.main">
            <CardActionArea>
                <CardMedia component="img" height="300" image={item.image} />

                <CardContent>
                    <Typography
                        gutterBottom
                        variant="h5"
                        component="div"
                        sx={{ color: "secondary.main" }}
                    >
                        {item.name}
                    </Typography>

                    <Typography variant="body2" color="text.secondary" pb={1}>
                        <b>Price:</b> € {item.price} | <b>Credit:</b> €{" "}
                        {item.credit}
                    </Typography>

                    <Typography
                        variant="body2"
                        sx={{ color: "text.secondary" }}
                    >
                        {item.description}
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}
