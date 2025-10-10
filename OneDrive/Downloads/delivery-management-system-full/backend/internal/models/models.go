package models
import "time"
type User struct { ID int `json:"id"`; Name string `json:"name"`; Email string `json:"email"`; Password string `json:"-"`; Role string `json:"role"` }
type OrderStatus string
const ( StatusCreated OrderStatus = "created"; StatusDispatched OrderStatus = "dispatched"; StatusInTransit OrderStatus = "in_transit"; StatusDelivered OrderStatus = "delivered"; StatusCancelled OrderStatus = "cancelled" )
type Order struct { ID int `json:"id"`; CustomerID int `json:"customer_id"`; Item string `json:"item"`; Status OrderStatus `json:"status"`; CreatedAt time.Time `json:"created_at"`; UpdatedAt time.Time `json:"updated_at"` }
