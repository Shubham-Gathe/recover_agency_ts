import type { IconButtonProps } from '@mui/material/IconButton';

import { useState, useCallback } from 'react';

import List from '@mui/material/List';
import Badge from '@mui/material/Badge';
import { ListItem } from '@mui/material';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';

import { fToNow } from 'src/utils/format-time';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

// ----------------------------------------------------------------------

type NotificationItemProps = {
  id: string;
  type: string;
  title: string;
  isUnRead: boolean;
  description: string;
  avatarUrl: string | null;
  postedAt: string | number | null;
};

export type NotificationsPopoverProps = IconButtonProps & {
  data?: NotificationItemProps[];
};

export function NotificationsPopover({ data = [], sx, ...other }: NotificationsPopoverProps) {
  const [notifications, setNotifications] = useState(data);

  const totalUnRead = notifications.filter((item) => item.isUnRead === true).length;

  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);

  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  const handleMarkAllAsRead = useCallback(() => {
    const updatedNotifications = notifications.map((notification) => ({
      ...notification,
      isUnRead: false,
    }));

    setNotifications(updatedNotifications);
  }, [notifications]);

  return (
    <>
       <IconButton
        color={openPopover ? 'primary' : 'default'}
        onClick={handleOpenPopover}
        sx={sx}
        {...other}
      >
        <Badge badgeContent={totalUnRead} color="error">
          <Iconify width={24} icon="solar:bell-bing-bold-duotone" />
        </Badge>
      </IconButton>

      <Popover
        open={!!openPopover}
        anchorEl={openPopover}
        onClose={handleClosePopover}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{
          paper: {
            sx: {
              width: 360,
              overflow: 'hidden',
            },
          },
        }}
      >
        <List
          sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
          subheader={
            <ListItem
              sx={{ py: 2, px: 2.5 }}
              secondaryAction={
                totalUnRead > 0 && (
                  <Tooltip title="Mark all as read">
                    <IconButton color="primary" onClick={handleMarkAllAsRead}>
                      <Iconify icon="solar:check-read-outline" />
                    </IconButton>
                  </Tooltip>
                )
              }
            >
              <ListItemText
                primary="Notifications"
                secondary={`You have ${totalUnRead} unread messages`}
                primaryTypographyProps={{ variant: 'subtitle1' }}
                secondaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
              />
            </ListItem>
          }
        >
          <Divider sx={{ borderStyle: 'dashed' }} />

          <Scrollbar fillContent sx={{ maxHeight: { xs: 360, sm: 'none' } }}>
            <ListSubheader sx={{ typography: 'overline', py: 1, px: 2.5 }}>New</ListSubheader>
            {notifications.slice(0, 2).map((notification) => (
              <ListItem key={notification.id} button>
                <NotificationItem notification={notification} />
              </ListItem>
            ))}

            <ListSubheader sx={{ typography: 'overline', py: 1, px: 2.5 }}>
              Before that
            </ListSubheader>
            {notifications.slice(2, 5).map((notification) => (
              <ListItem key={notification.id} button>
                <NotificationItem notification={notification} />
              </ListItem>
            ))}
          </Scrollbar>

          <Divider sx={{ borderStyle: 'dashed' }} />

          <ListItem button>
            <Button fullWidth disableRipple color="inherit">
              View all
            </Button>
          </ListItem>
        </List>
      </Popover>
    </>
  );
}

// ----------------------------------------------------------------------

function NotificationItem({ notification }: { notification: NotificationItemProps }) {
  const { avatarUrl, title } = renderContent(notification);

  return (
    <ListItemButton
      sx={{
        py: 1.5,
        px: 2.5,
        mt: '1px',
        ...(notification.isUnRead && {
          bgcolor: 'action.selected',
        }),
      }}
    >
      <ListItemAvatar>
        <Avatar sx={{ bgcolor: 'background.neutral' }}>{avatarUrl}</Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={title}
        secondary={
          <Typography
            variant="caption"
            sx={{
              mt: 0.5,
              gap: 0.5,
              display: 'flex',
              alignItems: 'center',
              color: 'text.disabled',
            }}
          >
            <Iconify width={14} icon="solar:clock-circle-outline" />
            {fToNow(notification.postedAt)}
          </Typography>
        }
      />
    </ListItemButton>
  );
}

// ----------------------------------------------------------------------

function renderContent(notification: NotificationItemProps) {
  const title = (
    <Typography variant="subtitle2">
      {notification.title}
      <Typography component="span" variant="body2" sx={{ color: 'text.secondary' }}>
        &nbsp; {notification.description}
      </Typography>
    </Typography>
  );

  if (notification.type === 'order-placed') {
    return {
      avatarUrl: (
        <img
          alt={notification.title}
          src="/assets/icons/notification/ic-notification-package.svg"
        />
      ),
      title,
    };
  }
  if (notification.type === 'order-shipped') {
    return {
      avatarUrl: (
        <img
          alt={notification.title}
          src="/assets/icons/notification/ic-notification-shipping.svg"
        />
      ),
      title,
    };
  }
  if (notification.type === 'mail') {
    return {
      avatarUrl: (
        <img alt={notification.title} src="/assets/icons/notification/ic-notification-mail.svg" />
      ),
      title,
    };
  }
  if (notification.type === 'chat-message') {
    return {
      avatarUrl: (
        <img alt={notification.title} src="/assets/icons/notification/ic-notification-chat.svg" />
      ),
      title,
    };
  }
  return {
    avatarUrl: notification.avatarUrl ? (
      <img alt={notification.title} src={notification.avatarUrl} />
    ) : null,
    title,
  };
}
