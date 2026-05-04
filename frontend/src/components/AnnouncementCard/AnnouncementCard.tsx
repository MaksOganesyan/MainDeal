import theme from "@/theme/theme";
import { useNavigate } from "react-router-dom";
import {
  Grid,
  Card,
  Box,
  Typography,
  CardContent,
  Chip,
  Divider,
  CardActions,
  Button,
} from "@mui/material";

import {
  Build as BuildIcon,
  Assignment as AssignmentIcon,
  AccountCircle as AccountCircleIcon,
  Star as StarIcon,
  LocationOn as LocationIcon,
  Category as CategoryIcon,
  AccessTime as TimeIcon,
  LocalOffer as PriceIcon,
  ArrowForward as ArrowForwardIcon,
} from "@mui/icons-material";
import styles from "./AnnouncementCard.module.css";
export default function AnnouncementCard({
  announcement,
}: {
  announcement: any;
}) {
  const navigate = useNavigate();
  
  return (
    <div className={styles.root}>
      <Grid item xs={12} sm={6} lg={4} key={announcement.id}>
        <Card
          elevation={3}
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            transition: "all 0.3s",
            "&:hover": {
              transform: "translateY(-8px)",
              boxShadow: theme.shadows[10],
            },
          }}
        >
          {announcement.isUrgent && (
            <Box sx={{ bgcolor: "error.main", color: "white", px: 2, py: 0.5 }}>
              <Typography variant="caption" fontWeight="bold">
                🔥 СРОЧНОЕ
              </Typography>
            </Box>
          )}

          <CardContent sx={{ flexGrow: 1, p: 3 }}>
            <Typography
              variant="h6"
              component="h3"
              gutterBottom
              fontWeight="bold"
            >
              {announcement.title}
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mb: 2,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                minHeight: "40px",
              }}
            >
              {announcement.description}
            </Typography>

            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
              <Chip
                icon={<CategoryIcon />}
                label={announcement.category}
                size="small"
                color="primary"
                variant="outlined"
              />
              {announcement.region && (
                <Chip
                  icon={<LocationIcon />}
                  label={announcement.region}
                  size="small"
                />
              )}
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {announcement.priceFrom && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <PriceIcon fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    от{" "}
                    <strong>{announcement.priceFrom.toLocaleString()} ₽</strong>
                  </Typography>
                </Box>
              )}
              {announcement.estimatedDays && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <TimeIcon fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    {announcement.estimatedDays} дней
                  </Typography>
                </Box>
              )}
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box>
              <Typography variant="caption" color="text.secondary">
                Исполнитель
              </Typography>
              <Typography variant="body2" fontWeight="medium">
                {announcement.executor?.fullName ||
                  announcement.executor?.login}
              </Typography>
              {announcement.executor?.profile?.rating > 0 && (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    mt: 0.5,
                  }}
                >
                  <StarIcon sx={{ fontSize: 16, color: "warning.main" }} />
                  <Typography variant="caption">
                    {announcement.executor.profile.rating.toFixed(1)} (
                    {announcement.executor.profile.totalReviews})
                  </Typography>
                </Box>
              )}
            </Box>
          </CardContent>

          <CardActions sx={{ p: 2, pt: 0 }}>
            <Button
              fullWidth
              variant="contained"
              onClick={() => navigate(`/announcements/${announcement.id}`)}
            >
              Подробнее
            </Button>
          </CardActions>
        </Card>
      </Grid>
    </div>
  );
}
