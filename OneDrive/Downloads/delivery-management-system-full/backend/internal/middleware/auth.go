package middleware
import ("context"; "net/http"; "strings"; "github.com/golang-jwt/jwt/v5"; "dms/config")
type key int; const UserContextKey key = 0
type TokenInfo struct{ UserID int; Role string }
func JWTAuth(cfg *config.Config, next http.Handler) http.Handler {
 return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
    h := r.Header.Get("Authorization"); if h=="" { http.Error(w,"missing auth",401); return }
    parts := strings.SplitN(h," ",2); if len(parts)!=2 || parts[0]!="Bearer" { http.Error(w,"invalid auth",401); return }
    tokenStr := parts[1]
    tok, err := jwt.Parse(tokenStr, func(t *jwt.Token) (interface{}, error) { return []byte(cfg.JWTSecret), nil })
    if err!=nil || !tok.Valid { http.Error(w,"invalid token",401); return }
    claims, ok := tok.Claims.(jwt.MapClaims); if !ok { http.Error(w,"invalid claims",401); return }
    subF, ok := claims["sub"].(float64); if !ok { http.Error(w,"invalid subject",401); return }
    role, _ := claims["role"].(string); ti := &TokenInfo{UserID:int(subF), Role: role}
    ctx := context.WithValue(r.Context(), UserContextKey, ti); next.ServeHTTP(w, r.WithContext(ctx))
    })
}
